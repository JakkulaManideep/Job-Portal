import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { useUser } from "@clerk/clerk-react";
import Swal from "sweetalert2";
import { jobsApi } from "../api/jobsApi";
import { jobSkillOptions } from "../utils/jobSkillOptions";
import { getErrorMessage } from "../utils/getErrorMessage";

const CreateJob = () => {
  const [selectedOption, setSelectedOption] = useState([]);
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const defaultEmail = useMemo(
    () => user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "",
    [user]
  );

  const onSubmit = async (data) => {
    try {
      await jobsApi.create({ ...data, skills: selectedOption });
      Swal.fire("Success", "Job posted successfully", "success");
      reset();
      setSelectedOption([]);
    } catch (error) {
      Swal.fire("Error", getErrorMessage(error), "error");
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <p className="text-sm text-gray-600">Posting as: {defaultEmail || "your account"}</p>

          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Title</label>
              <input
                type="text"
                placeholder="Enter Job Title"
                {...register("jobTitle", { required: true })}
                className="create-job-input"
              />
              {errors.jobTitle ? <p className="text-red-600 text-sm">Job title is required</p> : null}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                type="text"
                placeholder="Ex: Google"
                {...register("companyName", { required: true })}
                className="create-job-input"
              />
            </div>
          </div>

          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Minimum Salary</label>
              <input type="number" placeholder="Ex: 300000" {...register("minPrice")} className="create-job-input" />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary</label>
              <input
                type="number"
                placeholder="Ex: 1200000"
                {...register("maxPrice", { required: true })}
                className="create-job-input"
              />
            </div>
          </div>

          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary Type</label>
              <select {...register("salaryType", { required: true })} className="create-job-input">
                <option value="">Choose Salary Type</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Location</label>
              <input
                type="text"
                placeholder="Ex: Seattle"
                {...register("jobLocation", { required: true })}
                className="create-job-input"
              />
            </div>
          </div>

          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Posting Date</label>
              <input type="date" {...register("postingDate")} className="create-job-input" />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select {...register("experienceLevel", { required: true })} className="create-job-input">
                <option value="">Choose Experience Type</option>
                <option value="Fresher/No Experience">Fresher</option>
                <option value="Internship">Internship</option>
                <option value="Experienced">Experienced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-lg">Required Skill Sets</label>
            <CreatableSelect
              value={selectedOption}
              onChange={(selected) => setSelectedOption(selected || [])}
              options={jobSkillOptions}
              isMulti
              className="create-job-input py-4"
            />
          </div>

          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Logo</label>
              <input type="url" placeholder="Company Logo URL" {...register("companyLogo")} className="create-job-input" />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Employment Type</label>
              <select {...register("employmentType", { required: true })} className="create-job-input">
                <option value="">Choose Employment Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
          </div>

          <div className="w-full">
            <label className="block mb-2 text-lg">Job Description</label>
            <textarea
              className="w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700"
              rows={6}
              placeholder="Enter Job Description"
              {...register("description", { required: true })}
              style={{ resize: "none" }}
            />
          </div>

          <input
            type="submit"
            className="block bg-blue text-white font-semibold px-8 py-2 rounded-sm cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default CreateJob;