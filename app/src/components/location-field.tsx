import { Input } from "@/components/ui/input";

export function LocationField({
  id,
  label,
  placeholder,
  value,
  suggestions,
  open,
  onFocus,
  onChange,
  onSelect,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  suggestions: string[];
  open: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}) {
  return (
    <div data-location-autocomplete className="relative grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-md">
          <p className="px-3 py-2 text-xs text-muted-foreground">Suggested locations</p>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="flex w-full rounded-lg px-3 py-2 text-left text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelect(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
