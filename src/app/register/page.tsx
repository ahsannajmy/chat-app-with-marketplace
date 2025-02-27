"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z
  .object({
    username: z.string().trim().min(1, "Username can't be empty"),
    fullname: z.string().trim().min(1, "Fullname can't be empty"),
    password: z
      .string()
      .trim()
      .min(8, {
        message: "Password must contain atleast 8 characters long",
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must contain atleast one uppercase letter",
      })
      .refine((value) => /[a-z]/.test(value), {
        message: "Password must contain atleast one lowercase letter",
      })
      .refine((value) => /[0-9]/.test(value), {
        message: "Password must contain atleast one number",
      })
      .refine((value) => /[^a-zA-Z0-9]/.test(value), {
        message: "Password must contain atleast one special char",
      }),
    email: z.string().trim().min(1, "Email can't be empty").email({
      message: "Not a valid email address",
    }),
    confirmPassword: z.string().min(1, {
      message: "Password can't be empty",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullname: "",
      password: "",
      email: "",
      confirmPassword: "",
    },
  });

  async function registerHandler(values: z.infer<typeof registerSchema>) {
    const { username, email, fullname, password } = values;
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, fullname, password }),
    });
    const data = await response.json();
    if (response.ok) {
      if (data.success) {
        toast.success(data.message);
      }
    } else {
      toast.error(data.message);
    }
  }

  return (
    <>
      <div className="flex justify-center h-screen items-center">
        <Card className="p-4 w-2/3 h-auto">
          <CardHeader>
            <CardTitle>ChattanKuy</CardTitle>
            <CardDescription>Register your account here</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form
                className="grid grid-cols-2 gap-2"
                onSubmit={registerForm.handleSubmit(registerHandler)}
              >
                <div className="col-span-2">
                  <FormField
                    control={registerForm.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fullname</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input your fulname..."
                            {...field}
                            type="text"
                            onClick={() => registerForm.clearErrors("fullname")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input your username..."
                            {...field}
                            type="text"
                            onClick={() => registerForm.clearErrors("username")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input your email..."
                            {...field}
                            type="text"
                            onClick={() => registerForm.clearErrors("email")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <div className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Input
                              placeholder="Input your password..."
                              {...field}
                              type={showPassword ? "text" : "password"}
                              onClick={() =>
                                registerForm.clearErrors("password")
                              }
                            />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          >
                            {showPassword ? <Eye /> : <EyeClosed />}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <div className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Input
                              placeholder="Confirm your password..."
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              onClick={() =>
                                registerForm.clearErrors("confirmPassword")
                              }
                            />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={() => {
                              setShowConfirmPassword(!showConfirmPassword);
                            }}
                          >
                            {showConfirmPassword ? <Eye /> : <EyeClosed />}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2 col-span-2">
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                  <div className="flex flex-row items-center gap-1">
                    <Separator className="flex-1" />
                    <span className="text-gray-500 text-sm">OR</span>
                    <Separator className="flex-1" />
                  </div>
                  <Button asChild>
                    <Link href={"/login"}>Login</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
