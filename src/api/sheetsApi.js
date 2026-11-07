const FRIENDLY = {
  unauthorized: "That key was not accepted.",
  forbidden: "This key is not allowed to do that.",
  unknown_sheet: "The Google Sheet is missing a tab. Run setup() again in Apps Script.",
  invalid_id: "A record was rejected because it has no valid id.",
  missing_fields: "Please fill in the name, phone and address.",
  invalid_phone: "That phone number does not look right.",
  no_items: "The order has no valid items.",
  order_too_large: "That order is too large.",
};

export class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export function createSheetsApi({ url, token }) {
  async function call(action, payload = {}) {
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ token, action, ...payload }),
      });
    } catch {
      throw new ApiError("network", "Cannot reach Google Sheets. Check the URL and your connection.");
    }
    if (!res.ok) throw new ApiError("http", `The server answered with an error (${res.status}).`);
    let body;
    try {
      body = await res.json();
    } catch {
      throw new ApiError("format", "The API did not return data. Check that the Apps Script web app is deployed for 'Anyone'.");
    }
    if (!body.ok) throw new ApiError(body.error, FRIENDLY[body.error] || body.error || "Request failed");
    return body.data;
  }

  return {
    version: () => call("version"),
    snapshot: () => call("snapshot"),
    list: (sheet) => call("list", { sheet }),
    upsert: (sheet, record) => call("upsert", { sheet, record }),
    remove: (sheet, id, cascade = []) => call("delete", { sheet, id, cascade }),
  };
}
