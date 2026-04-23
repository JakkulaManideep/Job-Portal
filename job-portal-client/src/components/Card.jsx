import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

const Card = ({ data }) => {
  const {
    _id,
    companyName,
    jobTitle,
    companyLogo,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    employmentType,
    postingDate,
    description,
  } = data;

  return (
    <section className="card">
      <Link to={`/job/${_id}`} className="flex gap-4 flex-col sm:flex-row items-start">
        <img src={companyLogo} alt={companyName || "company logo"} className="card-logo" />

        <div className="min-w-0 w-full">
          <h4 className="text-primary mb-1 break-words">{companyName}</h4>
          <h3 className="text-lg font-semibold mb-2 break-words">{jobTitle}</h3>

          <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
            <span className="flex items-center gap-2 break-words">
              <FiMapPin /> {jobLocation}
            </span>
            <span className="flex items-center gap-2 break-words">
              <FiClock /> {employmentType}
            </span>
            <span className="flex items-center gap-2 break-words">
              <FiDollarSign /> {minPrice}-{maxPrice} {salaryType}
            </span>
            <span className="flex items-center gap-2 break-words">
              <FiCalendar /> {postingDate}
            </span>
          </div>

          <p className="text-base text-primary/70 break-words whitespace-normal card-description">
            {description}
          </p>
        </div>
      </Link>
    </section>
  );
};

export default Card;
