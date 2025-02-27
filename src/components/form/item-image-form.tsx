import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CloudUpload } from "lucide-react";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { createMultipleImages } from "@/utils/fetchHandler/productFetchHandler";

interface ItemImageFormProps {
  itemId: string | null;
}

export const ItemImageForm: React.FC<ItemImageFormProps> = (props) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [imagesPreview, setImagesPreview] = useState<string[] | null>(null);
  const createItemImageSchema = z.object({
    images: z
      .array(z.instanceof(File))
      .max(5, "You can only upload 5 images")
      .min(1, "Upload atleast one image")
      .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
        message: "File must atleast 5MB",
      })
      .refine(
        (files) =>
          files.every((file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type)
          ),
        {
          message: "Only image file supported is (JPEG, PNG, WEBP)",
        }
      ),
  });

  const createItemImageForm = useForm<z.infer<typeof createItemImageSchema>>({
    resolver: zodResolver(createItemImageSchema),
    defaultValues: {
      images: [],
    },
  });

  const createImageHandler = async (
    values: z.infer<typeof createItemImageSchema>
  ) => {
    try {
      setLoadingSubmit(true);
      const formData = new FormData();
      if (selectedIndex === null) {
        createItemImageForm.setError("images", {
          message: "Pick one image as a thumbnail",
        });
        setLoadingSubmit(false);
        return;
      }
      values.images.forEach((image, index) => {
        formData.append(`imageNo${index}`, image);
      });
      formData.append("thumbnail", selectedIndex.toString());
      if (!props.itemId) {
        createItemImageForm.setError("images", {
          message: "Fill the item details first",
        });
        setLoadingSubmit(false);
        return;
      }
      formData.append("itemId", props.itemId);

      const data = await createMultipleImages(formData);
      if (data && data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
      setLoadingSubmit(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occured in uploading the images");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const previews = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews)
      .then((images) => setImagesPreview(images))
      .catch((err) => console.log(err));
  };

  return (
    <Form {...createItemImageForm}>
      <form
        onSubmit={createItemImageForm.handleSubmit(createImageHandler)}
        className="space-y-2"
      >
        <FormField
          control={createItemImageForm.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tampilan Produk</FormLabel>
              <FormControl>
                <div>
                  <input
                    onChange={(e) => {
                      setSelectedIndex(null);
                      handleImageChange(e);
                      field.onChange(
                        e.target.files ? Array.from(e.target.files) : []
                      );
                    }}
                    accept="image/*"
                    type="file"
                    id="images-upload"
                    className="hidden"
                    onClick={() => {
                      createItemImageForm.clearErrors("images");
                    }}
                    multiple
                  />
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="images-upload"
                      className="relative h-64 flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
                    >
                      {imagesPreview &&
                      imagesPreview.length !== 0 &&
                      imagesPreview.length <= 5 ? (
                        <div className="grid grid-cols-3 gap-2 p-4 absolute inset-0">
                          {imagesPreview.map((image, index) => (
                            <div
                              key={index}
                              className="h-24 w-32 relative"
                              onClick={(e) => {
                                createItemImageForm.clearErrors("images");
                                e.preventDefault();
                                if (index === selectedIndex) {
                                  setSelectedIndex(null);
                                } else {
                                  setSelectedIndex(index);
                                }
                              }}
                            >
                              <Image
                                src={image}
                                alt={`preview no - ${index + 1}`}
                                fill
                                className={`object-cover rounded-md ${
                                  index === selectedIndex
                                    ? "rounded-md border-foreground border-4"
                                    : ""
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <CloudUpload />
                          <span>Click to upload or drag and drop</span>
                          <span>JPEG, WEBP, or PNG</span>
                          <span>Max. 5 MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </FormControl>

              <FormDescription className="flex flex-col text-xs">
                <>
                  <span className="text-red-500">*Required</span>
                  <span>- Minimal 1 gambar</span>
                  <span>- Maksimal 5 gambar</span>
                  <span>- Pilih 1 gambar yang ingin dijadikan thumbnail</span>
                </>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">
            {!loadingSubmit ? "Pasang Gambar" : "Loading..."}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
