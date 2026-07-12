export default function Input({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-white/70 text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-0.5">{error}</p>
      )}
    </div>
  )
}
