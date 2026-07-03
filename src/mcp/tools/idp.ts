import { create } from "@bufbuild/protobuf";
import { GetIDPByIDRequestSchema } from "@zitadel/proto/zitadel/idp/v2/idp_service_pb.js";
import type { ServiceClients } from "../../core";
import { DESC } from "../../core";
import type { ToolFactory } from "../tools";

export const getIdpTools: ToolFactory = (clients) => [
  {
    name: "idp_get",
    description: DESC.idp_get,
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "IDP ID" },
      },
      required: ["id"],
    },
    handler: async (args) => {
      const res = await clients.idp.getIDPByID(create(GetIDPByIDRequestSchema, { id: String(args.id) }));
      return res.idp;
    },
  },
];
