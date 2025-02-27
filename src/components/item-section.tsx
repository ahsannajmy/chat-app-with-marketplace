import { ItemHeader, ProductHeader } from "@/interface";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import React, { useEffect, useState } from "react";
import { getItemPerProduct } from "@/utils/fetchHandler/productFetchHandler";
import { LoadingSpinner } from "./spinner";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface ItemSectionProps {
  product: ProductHeader | null;
}

export const ItemSection: React.FC<ItemSectionProps> = (props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingData, setLoadingData] = useState(false);
  const [items, setItems] = useState<ItemHeader[] | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingData(true);
        if (props.product) {
          const data = await getItemPerProduct(props.product.id);
          if (data.success) {
            setItems(data.data);
          }
        }
        setLoadingData(false);
      } catch (error) {
        console.log(error);
        setLoadingData(false);
      }
    };
    fetchItems();
  }, [props.product]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="text-lg">
              Total Item -{" "}
              {props.product
                ? `${props.product.name} (${items?.length})`
                : "Semua Item"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="justify-items-center">
              <LoadingSpinner />
            </div>
          ) : items && items?.length > 0 ? (
            <div className="grid grid-cols-5 gap-2">
              {items.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => {
                    router.push(`${pathname}/item/${item.id}`);
                  }}
                >
                  <CardContent className="relative h-64 w-full p-0 cursor-pointer">
                    <div className="relative h-2/3 w-full">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={`image of ${item.name}`}
                          objectFit="cover"
                          layout="fill"
                        />
                      ) : (
                        <Image
                          src="/assets/image-placeholder.jpg"
                          alt="placeholder-img"
                          objectFit="cover"
                          layout="fill"
                        />
                      )}
                    </div>
                    <div className="h-1/3 py-4 px-2">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs leading-4">{item.name}</span>
                        <span className="text-sm font-extrabold">
                          {Number(item.price).toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Item untuk produk ini tidak ada
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
