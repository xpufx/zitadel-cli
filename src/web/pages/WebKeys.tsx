import { useEffect, useState } from "react";
import { useClients } from "../lib/auth";
import { fmtDate } from "../lib/format";
import { create } from "@bufbuild/protobuf";
import { ListWebKeysRequestSchema } from "@zitadel/proto/zitadel/webkey/v2/webkey_service_pb.js";

export function WebKeysPage() {
  const clients = useClients();
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clients.webkey.listWebKeys(create(ListWebKeysRequestSchema, {}))
      .then((res) => setKeys(res.webKeys ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [clients]);

  if (loading) return <div className="loading">Loading web keys...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Web Keys</h2>
        <p>{keys.length} key{keys.length !== 1 ? "s" : ""}</p>
      </div>
      {keys.length === 0 ? (
        <div className="empty-state">No web keys found</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>State</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k: any) => (
                <tr key={k.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{k.id}</td>
                  <td>{k.type ?? "-"}</td>
                  <td>{k.state ?? "-"}</td>
                  <td>{fmtDate(k.details?.creationDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
