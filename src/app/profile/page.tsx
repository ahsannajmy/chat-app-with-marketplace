"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, UserCog, CircleUserRound, Pencil, Cake } from "lucide-react";
import { UserHeader, UserProfileHeader } from "@/interface";
import React, { useEffect, useState } from "react";
import { useSession } from "@/context/session-context";
import {
  editProfile,
  fetchUserProfile,
} from "@/utils/fetchHandler/userProfileFetchHandler";
import { Skeleton } from "@/components/ui/skeleton";
import { createAlias } from "@/utils/string-utility";
import { getDayMonthYear, getYearMonth } from "@/utils/date-format";
import GlobalModal from "@/components/modal";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import Product from "@/components/product";
import { fetchFriends } from "@/utils/fetchHandler/homeFetchHanlder";
import FriendCard from "@/components/friend-card";

const editProfileSchema = z.object({
  fullname: z.string().trim().min(1, "Fullname can't be empty").optional(),
  bio: z
    .string()
    .max(160, "Your bio is reach maximum number of character")
    .optional(),
  dob: z.coerce.date(),
  imageProfile: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Profile must be a file",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "Only image file supported is (JPEG, PNG, WEBP)",
      }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File must be less than 5MB",
    })
    .optional(),
});

export default function UserProfile() {
  const { user } = useSession(); // current user session
  const [friends, setFriends] = useState<UserHeader[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Previewing Image in Modal using Bytes
  const [loading, setLoading] = useState(false); // loading for fetching
  const [bioLength, setBioLength] = useState(0);
  const [loadingEditProfile, setLoadingEditProfile] = useState(false); // loading for submitting form
  const [userProfile, setUserProfile] = useState<UserProfileHeader>({
    id: "",
    username: "",
    email: "",
    createdAt: new Date(),
    profile: {
      fullname: "",
    },
  });

  const editProfileForm = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullname: userProfile.profile.fullname || "",
      bio: userProfile.profile.bio || "",
      dob: userProfile.profile.dob
        ? new Date(userProfile.profile.dob)
        : new Date(),
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      editProfileForm.setValue("imageProfile", file);
    };
    reader.readAsDataURL(file);
  };

  const editProfileHandler = async (
    values: z.infer<typeof editProfileSchema>
  ) => {
    try {
      setLoadingEditProfile(true);
      const formData = new FormData();
      formData.append("fullname", values.fullname || "");
      formData.append("bio", values.bio || "");
      formData.append("dob", (values.dob || new Date()).toISOString());
      if (values.imageProfile) {
        formData.append("imageProfile", values.imageProfile);
      }
      if (user) {
        const data = await editProfile(user.id, formData);
        toast.success(data.message);
        setLoadingEditProfile(false);
        window.location.reload();
      } else {
        throw new Error("User data not found login first please");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
      setLoadingEditProfile(false);
    }
  };

  useEffect(() => {
    async function profileFetch() {
      setLoading(true);
      if (user) {
        const [userFriends, userProfile] = await Promise.all([
          fetchFriends(user.id),
          fetchUserProfile(user.id),
        ]);

        if (userProfile) {
          setFriends(userFriends);
        }

        if (userProfile) {
          setUserProfile(userProfile);
        }
      }
      setLoading(false);
    }

    profileFetch();
  }, [user]);

  useEffect(() => {
    editProfileForm.reset({
      fullname: userProfile.profile.fullname || "",
      bio: userProfile.profile.bio || "",
      dob: userProfile.profile.dob
        ? new Date(userProfile.profile.dob)
        : new Date(),
    });
    setBioLength(editProfileForm.getValues("bio")?.length || 0);
  }, [editProfileForm, userProfile]);

  return (
    <>
      <Header />
      <div className="grid grid-cols-3 gap-2 p-4 mt-4">
        <div className="col-span-2">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Profil Anda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row items-center justify-between relative">
                <div className="flex flex-col items-start gap-3">
                  <div>
                    {loading || userProfile.id === "" ? (
                      <Skeleton className="h-40 w-40 rounded-full" />
                    ) : (
                      <Avatar className="h-40 w-40">
                        <AvatarImage
                          className="object-cover"
                          src={userProfile.profile.imageProfile || "#"}
                        />
                        <AvatarFallback>
                          <span className="text-7xl">
                            {createAlias(userProfile.profile.fullname || "")}
                          </span>
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    {loading || userProfile.id === "" ? (
                      <>
                        <Skeleton className="h-4 w-72" />
                        <Skeleton className="h-4 w-52" />
                        <Skeleton className="h-4 w-92" />
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-lg">
                          {userProfile.username}
                        </span>
                        <span className="font-semibold text-sm text-gray-500">
                          {userProfile.email}
                        </span>
                        <span>
                          {userProfile.profile.bio ||
                            `${userProfile.username} tidak memiliki bio`}
                        </span>
                      </>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-row items-center gap-2">
                      {loading || userProfile.id === "" ? (
                        <Skeleton className="h-4 w-96" />
                      ) : (
                        <>
                          <Calendar size={18} />
                          <span className="text-gray-500 text-sm">
                            Bergabung dengan ChattanKuy sejak{" "}
                            {getYearMonth(new Date(userProfile.createdAt))}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-row items-center gap-2">
                      {loading || userProfile.id === "" ? (
                        <Skeleton className="h-4 w-72" />
                      ) : (
                        <>
                          <Cake size={18} />
                          <span className="text-gray-500 text-sm">
                            Lahir tanggal{" "}
                            {userProfile.profile.dob
                              ? getDayMonthYear(
                                  new Date(userProfile.profile.dob)
                                )
                              : "Tidak ada informasi tanggal lahir"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0">
                  <GlobalModal
                    title="Ubah Profil Anda"
                    description="Profil anda menentukan bagaimana kawan anda mengenali anda"
                    buttonTriggerText="Ubah Profil"
                    Icon={UserCog}
                  >
                    <Form {...editProfileForm}>
                      <form
                        onSubmit={editProfileForm.handleSubmit(
                          editProfileHandler
                        )}
                      >
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={editProfileForm.control}
                            name="imageProfile"
                            render={() => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative w-fit">
                                    <label>
                                      {userProfile.profile.imageProfile &&
                                      !imagePreview ? (
                                        <Image
                                          src={userProfile.profile.imageProfile}
                                          height={96}
                                          width={96}
                                          alt="your-image"
                                          className="h-24 w-24 object-cover rounded-full"
                                        />
                                      ) : imagePreview ? (
                                        <Image
                                          src={imagePreview}
                                          height={96}
                                          width={96}
                                          alt="preview-image"
                                          className="h-24 w-24 object-cover rounded-full"
                                        />
                                      ) : (
                                        <CircleUserRound size={96} />
                                      )}
                                    </label>

                                    <input
                                      type="file"
                                      accept="image/*"
                                      id="avatar-upload"
                                      className="hidden"
                                      onChange={handleImageChange}
                                    />
                                    <label
                                      htmlFor="avatar-upload"
                                      className="absolute top-0 right-0 p-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow cursor-pointer"
                                    >
                                      <Pencil
                                        size={16}
                                        className="text-black"
                                      />
                                    </label>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editProfileForm.control}
                            name="fullname"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fullname</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Change your fullname"
                                    {...field}
                                    type="text"
                                    onClick={() =>
                                      editProfileForm.clearErrors("fullname")
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editProfileForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <div className="flex flex-col gap-1">
                                    <Textarea
                                      placeholder="Express yourself..."
                                      className="h-32"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setBioLength(
                                          e.target.value.trim().length
                                        );
                                      }}
                                      onClick={() =>
                                        editProfileForm.clearErrors("bio")
                                      }
                                    />
                                    <span className="self-end text-xs text-gray-500">{`${bioLength}/160`}</span>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editProfileForm.control}
                            name="dob"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date Of Birth</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="date"
                                    value={
                                      field.value
                                        ? new Date(field.value)
                                            .toISOString()
                                            .split("T")[0]
                                        : new Date().toISOString().split("T")[0]
                                    }
                                    onClick={() =>
                                      editProfileForm.clearErrors("dob")
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <DialogFooter className="mt-2">
                          <Button type="submit">
                            {!loadingEditProfile
                              ? "Simpan Perubahan"
                              : "Loading..."}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </GlobalModal>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Temanmu...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {friends.map((friend, index) => (
                  <FriendCard
                    key={index}
                    id={friend.id}
                    alias={createAlias(friend.profile.fullname)}
                    username={friend.username}
                    imageProfile={friend.profile.imageProfile || "#"}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3">
          <Product user={user} loading={loading} />
        </div>
      </div>
    </>
  );
}
