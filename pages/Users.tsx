import React from "react";
import UsersTable from "../ui/UsersTable";

const Users: React.FC = () => {
  return (
    <div className="mx-4 md:mx-8 mb-8 pt-6 md:pt-10">
      <UsersTable />
    </div>
  );
};

export default Users;
