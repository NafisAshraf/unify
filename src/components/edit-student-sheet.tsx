"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SetPasswordInput from "./set-password-input";
import { DatePicker } from "react-aria-components";
import DatePickerInput from "./date-picker-input";
import PhoneNumberInput from "./phone-number-input";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { CircleCheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

type EditStudentSheetProps = React.ComponentPropsWithoutRef<"div"> & {
  onSuccess: (student: any) => void;
  row: any;
};

export function EditStudentSheet({
  className,
  row,
  onSuccess,
  ...props
}: EditStudentSheetProps) {
  const [name, setName] = useState(row.original.name);
  const [department, setDepartment] = useState(row.original.department);
  const [gender, setGender] = useState(row.original.gender);
  const [dateOfBirth, setDateOfBirth] = useState(
    new Date(row.original.date_of_birth)
  );
  const [phoneNumber, setPhoneNumber] = useState(row.original.phone_number);
  const [email, setEmail] = useState(row.original.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  //   const [studentData, setStudentData] = useState<any>(null);
  let studentData: any;

  console.log("abcd", row);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      // Populate the Students table
      const { data, error } = await supabase
        .from("Students")
        .update({
          name,
          email,
          date_of_birth: dateOfBirth.toISOString().split("T")[0],
          gender,
          phone_number: phoneNumber,
          department: department,
        })
        .eq("id", row.original.id)
        .select();
      if (error) {
        toast.error(error.message);
        console.log("Error", error);
      } else if (!data || data.length === 0) {
        console.log("Data", data);
        toast.error(`No record found with ID ${row.original.id}`);
        setIsLoading(false);
        return;
      }

      studentData = data;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);

      if (studentData && studentData.length > 0) {
        onSuccess(studentData[0]);
        toast.success("Student updated successfully");
      }
    }
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Edit Student Information</SheetTitle>
        <SheetDescription>
          Fill out the form to edit a student's information. Click Submit when
          done.
        </SheetDescription>
      </SheetHeader>
      <div className={cn("flex flex-col  items-center ", className)} {...props}>
        <div className="w-full px-6  py-0 my-0">
          <form onSubmit={handleEdit}>
            <div className="">
              {/* First Column */}
              <div className="flex flex-col justify-center gap-6 ">
                {/* Name Input */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Department, Gender Input */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Department Input */}
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={department}
                      onValueChange={setDepartment}
                      required
                    >
                      <SelectTrigger className="w-[100%]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {/* <SelectLabel>Fruits</SelectLabel> */}
                          <SelectItem value="CSE">CSE</SelectItem>
                          <SelectItem value="BBA">BBA</SelectItem>
                          <SelectItem value="EEE">EEE</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gender Input */}
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender} required>
                      <SelectTrigger className="w-[100%]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date of Birth Input */}
                <div className="grid gap-2">
                  <DatePickerInput
                    dateOfBirth={dateOfBirth}
                    setDateOfBirth={setDateOfBirth}
                  />
                </div>

                {/* Phone Number Input */}
                <div className="grid gap-2">
                  <PhoneNumberInput
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                  />
                </div>
                {/* Email Input */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {/* <SheetFooter>
              <SheetClose asChild> */}
            <div className="py-10">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </div>
            {/* </SheetClose>
            </SheetFooter> */}
          </form>
        </div>
      </div>
    </>
  );
}
