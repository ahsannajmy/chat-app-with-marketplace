import { useSession } from "@/context/session-context";
import { ProductHeader } from "@/interface";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { createProduct } from "@/utils/fetchHandler/productFetchHandler";

interface ProductFormProps {
  editForm: boolean;
  updateProductData: (newProduct: ProductHeader) => void;
}

export const ProductForm: React.FC<ProductFormProps> = (props) => {
  const { user } = useSession();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const createProductFormSchema = z.object({
    name: z.string().min(1, "Nama produk tidak bisa kosong"),
  });

  const createProductForm = useForm<z.infer<typeof createProductFormSchema>>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const createProductHandler = async (
    values: z.infer<typeof createProductFormSchema>
  ) => {
    try {
      setLoadingSubmit(true);
      if (user) {
        const data = await createProduct(user.id, values);
        if (data.success) {
          props.updateProductData(data.data);
          toast.success(data.message);
          setLoadingSubmit(false);
        } else {
          toast.error(data.message);
          setLoadingSubmit(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occured in submitting");
      setLoadingSubmit(false);
    }
  };

  return (
    <Form {...createProductForm}>
      <form
        onSubmit={createProductForm.handleSubmit(createProductHandler)}
        className="space-y-2"
      >
        <FormField
          control={createProductForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Produk</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nama produk..."
                  {...field}
                  onClick={() => createProductForm.clearErrors("name")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <div className="flex flex-row gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => createProductForm.reset()}
            >
              Reset
            </Button>
            <Button type="submit">
              {loadingSubmit ? "Loading..." : "Tambah Produk"}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
};
