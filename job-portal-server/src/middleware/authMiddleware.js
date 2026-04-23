const asyncHandler = require("./asyncHandler");

const jwksCache = new Map();

const getJwks = async (issuer) => {
  if (jwksCache.has(issuer)) {
    return jwksCache.get(issuer);
  }

  const { createRemoteJWKSet } = await import("jose");
  const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
  jwksCache.set(issuer, jwks);
  return jwks;
};

const verifyClerkToken = async (token) => {
  const { decodeJwt, jwtVerify } = await import("jose");

  const decoded = decodeJwt(token);
  const issuer = process.env.CLERK_ISSUER || decoded.iss;

  if (!issuer) {
    throw new Error("Unable to determine token issuer");
  }

  const jwks = await getJwks(issuer);
  const { payload } = await jwtVerify(token, jwks, { issuer });
  return payload;
};

const fetchClerkUser = async (userId) => {
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!secretKey) {
    throw new Error("CLERK_SECRET_KEY is required on server");
  }

  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch Clerk user profile");
  }

  return response.json();
};

const requireAuthUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const payload = await verifyClerkToken(token);
  const userId = payload.sub;

  if (!userId) {
    return res.status(401).json({ message: "Invalid authentication token" });
  }

  const user = await fetchClerkUser(userId);

  const primaryEmail =
    user.email_addresses?.find((email) => email.id === user.primary_email_address_id)?.email_address ||
    user.email_addresses?.[0]?.email_address ||
    "";

  const role = user.public_metadata?.role || user.unsafe_metadata?.role || "";

  req.authUser = {
    userId,
    email: String(primaryEmail).toLowerCase().trim(),
    role: String(role || "").trim(),
  };

  next();
});

const requireRole = (...allowedRoles) => (req, res, next) => {
  const currentRole = req.authUser?.role;

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return res.status(403).json({
      message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
    });
  }

  next();
};

module.exports = {
  requireAuthUser,
  requireRole,
};