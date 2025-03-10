
import React from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AddUserButton = () => {
  return (
    <Button>
      <UserPlus className="h-4 w-4 mr-2" />
      Add User
    </Button>
  );
};

export default AddUserButton;
