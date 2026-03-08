import { QRCodeSVG } from "qrcode.react";

interface Props {
  sessionId: string;
  size?: number;
}

export default function QRPairingPanel({ sessionId, size = 200 }: Props) {
  const joinUrl = `${window.location.protocol}//${window.location.host}/view/${sessionId}`;
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card bg-white">
        <QRCodeSVG
          value={joinUrl}
          size={size}
          bgColor="#ffffff"
          fgColor="#1a1a2e"
          level="L"
          className="rounded-lg"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Scan to connect</p>
        <p className="text-xs text-muted-foreground mt-1">
          Session: <span className="font-mono font-semibold">{sessionId}</span>
        </p>
        {isLocalhost && (
          <p className="text-[10px] text-destructive mt-1 max-w-[200px] leading-tight text-center mx-auto">
            Viewing on localhost. To scan from a phone, access this app via your local Network IP.
          </p>
        )}
      </div>
    </div>
  );
}
