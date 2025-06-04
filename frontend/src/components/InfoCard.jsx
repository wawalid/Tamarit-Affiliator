function InfoCard({ label, value }) {
  return (
    <div className="flex flex-col bg-zinc-700 p-4 rounded">
      <span className="text-sm text-gray-400">{label}</span>
      <span
        className="font-semibold truncate max-w-xs"
        title={value}
      >
        {value || "—"}
      </span>
    </div>
  );
}


export default InfoCard;
