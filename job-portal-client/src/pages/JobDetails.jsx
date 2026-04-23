import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Swal from "sweetalert2";
import PageHeader from "../components/PageHeader";
import { jobsApi } from "../api/jobsApi";
import { getErrorMessage } from "../utils/getErrorMessage";
import { USER_ROLES, getUserRole } from "../utils/roles";

const JobDetails = () => {
  const { id } = useParams();
  const { user, isSignedIn } = useUser();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const role = getUserRole(user);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const data = await jobsApi.getById(id);
        setJob(data);
      } catch (error) {
        Swal.fire("Error", getErrorMessage(error), "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Apply for this job",
      html: '<input id="swal-input1" class="swal2-input" placeholder="Resume link" type="url">',
      focusConfirm: false,
      preConfirm: () => {
        const resumeLink = document.getElementById("swal-input1").value;

        if (!resumeLink) {
          Swal.showValidationMessage("Resume link is required");
          return null;
        }

        return { resumeLink };
      },
    });

    if (!formValues) return;

    try {
      await jobsApi.apply(id, formValues);
      Swal.fire("Success", "Application submitted successfully", "success");
    } catch (error) {
      Swal.fire("Error", getErrorMessage(error), "error");
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <PageHeader title={"Single Job Page"} path={"Single Job"} />
      {isLoading ? (
        <p className="pt-16">Loading...</p>
      ) : !job ? (
        <p className="pt-16">Job not found</p>
      ) : (
        <div className="pt-16 space-y-4">
          <h2>
            <span className="text-xl font-bold text-blue-500">Job Details:</span> {job._id}
          </h2>
          <h1 className="text-2xl font-display text-gray-900">{job.jobTitle}</h1>
          <p className="text-gray-700">{job.description}</p>

          {!isSignedIn ? (
            <Link to="/login" className="bg-blue px-8 py-2 text-white inline-block">
              Login to Apply
            </Link>
          ) : role !== USER_ROLES.JOB_SEEKER ? (
            <p className="text-sm text-gray-600">Only Job Seeker accounts can apply to jobs.</p>
          ) : (
            <button className="bg-blue px-8 py-2 text-white" onClick={handleApply}>
              Apply Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;