import React from "react";

const RoleBasedView = ({ role, student, instructor, admin }) => {
  if (role === "student") return student;
  if (role === "instructor") return instructor;
  if (role === "admin") return admin;

  return null;
};

export default RoleBasedView;
