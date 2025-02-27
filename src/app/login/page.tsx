"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSession } from "@/context/session-context";
import { fetchUserDataLoggedIn } from "@/utils/fetchHandler/homeFetchHanlder";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  username: z.string().trim().min(1, { message: "Username can't be empty" }),
  password: z.string().trim().min(1, { message: "Password can't be empty" }),
});

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { updateSession } = useSession();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function loginHandler(values: z.infer<typeof loginSchema>) {
    toast.info("Loading...");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      if (data.success) {
        toast.success(data.message);

        const userData = await fetchUserDataLoggedIn();
        updateSession(userData);

        router.push("/");
      }
    }

    toast.error(data.message);
  }

  return (
    <>
      <div className="flex justify-center h-screen items-center">
        <Card className="p-4 w-1/3 h-auto">
          <CardHeader>
            <CardTitle>ChattanKuy</CardTitle>
            <CardDescription>Login to your account here</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(loginHandler)}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Input your username..."
                          {...field}
                          type="text"
                          onClick={() => form.clearErrors("username")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Input
                            placeholder="Input your password..."
                            type={showPassword ? "text" : "password"}
                            {...field}
                            onClick={() => form.clearErrors("password")}
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
                <div className="mt-4 flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <div className="flex flex-row items-center gap-1">
                    <Separator className="flex-1" />
                    <span className="text-gray-500 text-sm">OR</span>
                    <Separator className="flex-1" />
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={"/register"}>Register</Link>
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
