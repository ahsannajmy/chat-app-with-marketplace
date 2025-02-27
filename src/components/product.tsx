import { ProductHeader, UserHeader } from "@/interface";
import { Card, CardContent, CardTitle, CardHeader } from "./ui/card";
import { SquarePlus } from "lucide-react";
import GlobalModal from "./modal";

import { ProductSection } from "./product-section";
import { ItemSection } from "./item-section";
import { useEffect, useState } from "react";
import { getProduct } from "@/utils/fetchHandler/productFetchHandler";
import { useSession } from "@/context/session-context";
import { toast } from "sonner";

import { ProductForm } from "./form/product-form";
import { ItemForm } from "./form/item-form";
import { ItemImageForm } from "./form/item-image-form";

interface ProductProps {
  user: UserHeader | null;
  loading: boolean;
}

const Product: React.FC<ProductProps> = () => {
  const { user } = useSession();
  const [selectedProduct, setSelectedProduct] = useState<ProductHeader | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(false);
  const [product, setProduct] = useState<ProductHeader[] | null>(null);
  const [itemFormStep, setItemFormStep] = useState(0);
  const [itemId, setItemId] = useState<string | null>(null);

  const updateItemFormStep = () => {
    setItemFormStep(1);
  };

  const resetItemId = () => {
    setItemId(null);
  };

  const updateItemId = (id: string) => {
    setItemId(id);
  };

  const updateSelectedProduct = (product: ProductHeader) => {
    setSelectedProduct(product);
  };

  const updateProduct = (newProduct: ProductHeader) => {
    setProduct((product) =>
      product ? [...product, newProduct] : [newProduct]
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (user) {
          setLoadingData(true);
          const data = await getProduct(user.id);
          if (data.success) {
            setProduct(data.data);
            setLoadingData(false);
          } else {
            toast.error(data.message);
            setLoadingData(false);
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occured in fetching products");
        setLoadingData(false);
      }
    };

    fetchProducts();
  }, [user]);

  return (
    <>
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Toko Anda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-row items-center gap-2">
              <GlobalModal
                title="Tambah Produk Baru"
                description="Tambahkan produk baru untuk tokomu disini"
                buttonTriggerText="Tambah Produk"
                Icon={SquarePlus}
              >
                <ProductForm
                  editForm={false}
                  updateProductData={updateProduct}
                />
              </GlobalModal>
              <GlobalModal
                title="Tambah Item Baru"
                description={`${
                  itemFormStep === 0
                    ? "Isi form detail item untuk item baru"
                    : "Pilih gambar item untuk ditampilkan"
                }`}
                buttonTriggerText="Tambah Item"
                openHandler={resetItemId}
                Icon={SquarePlus}
              >
                {itemFormStep === 0 ? (
                  <ItemForm
                    product={product || []}
                    updateFormSteps={updateItemFormStep}
                    updateItemId={updateItemId}
                  />
                ) : (
                  <ItemImageForm itemId={itemId} />
                )}
              </GlobalModal>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <ProductSection
                  data={product}
                  loading={loadingData}
                  selectedProductHandler={updateSelectedProduct}
                />
              </div>
              <div className="col-span-4">
                <ItemSection product={selectedProduct} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Product;
