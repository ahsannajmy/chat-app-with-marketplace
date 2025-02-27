"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { ItemHeader } from "@/interface";
import { getItemById } from "@/utils/fetchHandler/productFetchHandler";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserItemProfile() {
  const params = useParams();
  const itemId = params.itemId as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [part, setPart] = useState("deskripsi");
  const [item, setItem] = useState<ItemHeader | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemById(itemId);
        if (data.success) {
          setItem(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchItem();
  }, [itemId]);

  return (
    <>
      <Header />
      <div className="grid grid-cols-5 gap-2 p-4 mt-4">
        <div className="col-span-2 mx-auto">
          <div className="flex flex-col gap-2">
            <div className="relative w-80 h-80">
              {item && item.imageItems.length !== 0 ? (
                <Image
                  src={
                    item.imageItems.at(selectedImageIndex)?.imageUrl ||
                    "/assets/image-placeholder.jpg"
                  }
                  className="rounded-lg"
                  alt="image-item"
                  fill
                  objectFit="cover"
                />
              ) : (
                <Image
                  src="/assets/image-placeholder.jpg"
                  alt="placeholder-img"
                  fill
                  objectFit="cover"
                />
              )}
            </div>
            <div className="flex flex-row items-center gap-2">
              {item &&
                item.imageItems.length !== 0 &&
                item.imageItems.map((imageItem, index) => (
                  <div
                    key={index}
                    className="relative h-24 w-24 cursor-pointer"
                    onClick={() => {
                      setSelectedImageIndex(index);
                    }}
                  >
                    <Image
                      src={imageItem.imageUrl}
                      className="rounded-lg"
                      alt="image-item"
                      fill
                      objectFit="cover"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-xl">{item?.name}</span>
            <span className="font-extrabold text-3xl">
              {Number(item?.price).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </span>
            <Separator />
            <div className="flex items-center space-x-4">
              <div>
                <span
                  className={`${
                    part === "deskripsi" ? "bg-green-400 rounded-md" : ""
                  } p-1`}
                  onClick={() => setPart("deskripsi")}
                >
                  Deskripsi
                </span>
              </div>
              <div>
                <span
                  className={`${
                    part === "info" ? "bg-green-400 rounded-md" : ""
                  } p-1`}
                  onClick={() => setPart("info")}
                >
                  Info
                </span>
              </div>
            </div>
            <Separator />
            <div>
              <p>{part === "deskripsi" ? item?.description : item?.info}</p>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}
