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

type AddStudentSheetProps = React.ComponentPropsWithoutRef<"div"> & {
  onSuccess: (student: any) => void;
};

export function AddStudentSheet({
  className,
  onSuccess,
  ...props
}: AddStudentSheetProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  //   const [studentData, setStudentData] = useState<any>(null);
  let studentData: any;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      // Populate the Students table
      const { data, error: studentError } = await supabase
        .from("Students")
        .insert([
          {
            name,
            email: email,
            credits_completed: 0,
            cgpa: 0,
            date_of_birth: dateOfBirth.toISOString().split("T")[0],
            gender: gender,
            image_url:
              gender === "Male"
                ? "https://avatar.iran.liara.run/public/boy"
                : "https://avatar.iran.liara.run/public/girl",
            phone_number: phoneNumber,
            user_id: null,
            department: department,
          },
        ])
        .select();
      if (studentError) throw studentError;
      //   console.log(studentError);
      studentData = data;
      console.log(studentData);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
      onSuccess(studentData[0]);
      console.log(studentData);
      toast.success("Student added successfully");
    }
  };

  return (
    <>
      <SheetHeader>
        <SheetTitle>Add Student</SheetTitle>
        <SheetDescription>
          Fill out the form to add a new student. Click Submit when done.
        </SheetDescription>
      </SheetHeader>
      <div className={cn("flex flex-col  items-center ", className)} {...props}>
        <div className="w-full px-6  py-0 my-0">
          <form onSubmit={handleSignUp}>
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
                    <Select onValueChange={setDepartment} required>
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
                    <Select onValueChange={setGender} required>
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
                {isLoading ? "Adding Student..." : "Submit"}
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
