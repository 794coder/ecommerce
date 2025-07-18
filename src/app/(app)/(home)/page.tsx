import configPromise from "@payload-config";
import { getPayload } from "payload";

const Page = async () => {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "Categories",
  });
  return <div className="p-4">{JSON.stringify(data, null, 2)}</div>;
};

export default Page;
