import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ProductHeader } from "@/interface";
import { createItem } from "@/utils/fetchHandler/productFetchHandler";
import { toast } from "sonner";

interface ItemFormProps {
  product: ProductHeader[];
  updateFormSteps: () => void;
  updateItemId: (id: string) => void;
}

export const ItemForm: React.FC<ItemFormProps> = (props) => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [infoLength, setInfoLength] = useState(0);
  const createItemFormSchema = z.object({
    name: z.string().min(1, "Nama item tidak bisa kosong"),
    productId: z.string(),
    description: z
      .string()
      .min(1, "Deksripsi item tidak bisa kosong")
      .max(2000, "Deskripsi telah mencapai batas maksimum kata"),
    info: z
      .string()
      .min(1, "Informasi item tidak bisa kosong")
      .max(160, "Informasi telah mencapai batas maksimum"),
    price: z.coerce.number().min(0, "Harga tidak bisa kurang dari nol"),
    stock: z.coerce.number().min(0, "Stok tidak bisa kurang dari nol"),
  });

  const createItemForm = useForm<z.infer<typeof createItemFormSchema>>({
    resolver: zodResolver(createItemFormSchema),
    defaultValues: {
      name: "",
      productId: "",
      description: "",
      info: "",
      price: 0,
      stock: 0,
    },
  });

  const createItemHandler = async (
    values: z.infer<typeof createItemFormSchema>
  ) => {
    try {
      setLoadingSubmit(true);
      const data = await createItem(values);
      if (data && data.success) {
        toast.success(data.message);
        props.updateFormSteps();
        props.updateItemId(data.data.id);
      } else {
        toast.error(data.message);
      }
      setLoadingSubmit(false);
    } catch (error) {
      console.log(error);
      toast.error("An error occured in submitting");
      setLoadingSubmit(false);
    }
  };

  return (
    <Form {...createItemForm}>
      <form
        className="space-y-2"
        onSubmit={createItemForm.handleSubmit(createItemHandler)}
      >
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={createItemForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama item..."
                    {...field}
                    onClick={() => createItemForm.clearErrors("name")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createItemForm.control}
            name="productId"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Produk</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih produk yang sesuai" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {props.product.map((product) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={product.id}
                        value={product.id}
                      >
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createItemForm.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-1">
                    <Textarea
                      placeholder="Deskripsi item..."
                      className="h-32"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setDescriptionLength(e.target.value.trim().length);
                      }}
                      onClick={() => createItemForm.clearErrors("description")}
                    />
                    <span className="self-end text-xs text-gray-500">{`${descriptionLength}/2000`}</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createItemForm.control}
            name="info"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Info</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-1">
                    <Textarea
                      placeholder="Info item..."
                      {...field}
                      onClick={() => createItemForm.clearErrors("info")}
                      onChange={(e) => {
                        field.onChange(e);
                        setInfoLength(e.target.value.trim().length);
                      }}
                    />
                    <span className="text-xs text-gray-500 self-end">{`${infoLength}/160`}</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createItemForm.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Harga item..."
                    {...field}
                    required
                    value={
                      field.value
                        ? field.value.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                        : "Rp 0"
                    }
                    onClick={() => createItemForm.clearErrors("price")}
                    onChange={(e) => {
                      const realValue = e.target.value.replace(/\D/g, "");
                      field.onChange(realValue ? Number(realValue) : "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createItemForm.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Stok item..."
                    {...field}
                    value={
                      field.value ? field.value.toLocaleString("id-ID") : 0
                    }
                    onClick={() => createItemForm.clearErrors("stock")}
                    onChange={(e) => {
                      const realValue = e.target.value.replace(/\D/g, "");
                      field.onChange(realValue ? Number(realValue) : "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <div className="flex flex-row gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => createItemForm.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={loadingSubmit}>
              {loadingSubmit ? "Loading..." : "Tambah Item"}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
};
