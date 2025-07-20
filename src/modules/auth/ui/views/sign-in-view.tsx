"use client";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";

type formType = z.infer<typeof loginSchema>;

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});
export const SignInView = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => toast.error(error.message),
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    })
  );
  //one way to login
  // const login = useMutation({
  //   mutationFn: async (values: formType) => {
  //     const response = await fetch("/api/users/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(values),
  //     });
  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || "Login failed");
  //     }
  //     return response.json();
  //   },
  //   onError: (error) => toast.error(error.message),
  //   onSuccess: () => router.push("/"),
  // });
  const router = useRouter();
  const form = useForm<formType>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (values: formType) => {
    login.mutate(values);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="h-screen bg-[#f4f4f0] w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span
                  className={cn("text-2xl font-semibold", poppins.className)}
                >
                  funroad
                </span>
              </Link>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-base border-none underline"
              >
                <Link href="/sign-up" prefetch>
                  Sign Up
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">Welcome back to Funroad</h1>
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={login.isPending}
              type="submit"
              size="lg"
              variant="elevated"
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              Log In
            </Button>
          </form>
        </Form>
      </div>
      <div
        style={{
          backgroundImage: "url('/random.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="h-screen w-col lg:col-span-2 hidden lg:block"
      />
    </div>
  );
};
