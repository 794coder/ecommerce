"use client";
import { SearchInput } from "./search-input";
import { Categories } from "./categories";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import { BreadCrumbNavigation } from "./breadcrumb-navigation";

export const SearchFilters = () => {
  const params = useParams();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";
  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory
  );
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubcategory = params.subcategory as string | undefined;
  const activeSubcategoryName =
    activeCategoryData?.subcategories.find(
      (sub) => sub.slug === activeSubcategory
    )?.name || null;
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: activeCategoryColor,
      }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadCrumbNavigation
        activeCategoryName={activeCategoryName}
        activeCategory={activeCategory}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
};

export const SearchFilterLoading = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
