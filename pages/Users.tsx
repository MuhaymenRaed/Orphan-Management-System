import React from "react";
import UsersTable from "../ui/UsersTable";

const Users: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start pt-10">
      <UsersTable />
    </div>
  );
};

export default Users;
