import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ProductHeader } from "@/interface";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

interface ProductSectionProps {
  loading: boolean;
  data: ProductHeader[] | null;
  selectedProductHandler: (product: ProductHeader) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = (props) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="text-lg">
              Total Produk ({props.data && props.data.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {props.loading ? (
              <>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : props.data && props.data.length > 0 ? (
              props.data.map((product) => (
                <div key={product.id}>
                  <Button
                    className="w-full text-left justify-start"
                    variant="outline"
                    onClick={() => props.selectedProductHandler(product)}
                  >
                    {product.name}
                  </Button>
                </div>
              ))
            ) : (
              <>
                <span className="text-gray-500 text-sm">Produk tidak ada</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
