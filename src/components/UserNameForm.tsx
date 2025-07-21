import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface UserNameFormProps {
  user: Pick<User, "id" | "username">;
}

const UserNameForm: FC<UserNameFormProps> = ({ user }) => {
  const {} = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user.username || "", // Default to user's current username
    },
  });

  return <form></form>;
};

export default UserNameForm;
