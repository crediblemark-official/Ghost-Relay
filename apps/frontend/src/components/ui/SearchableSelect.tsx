import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

interface SearchableSelectProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  customOptionLabel?: string
  onCustomSelect?: () => void
  disabled?: boolean
  readOnly?: boolean
}

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Cari...',
  customOptionLabel,
  onCustomSelect,
  disabled = false,
  readOnly = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Sinkronisasi searchQuery dengan value saat value berubah atau dropdown ditutup
  useEffect(() => {
    setSearchQuery(value)
  }, [value])

  // Tutup dropdown saat klik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery(value) // Reset query ke value asli
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [value])

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (val: string) => {
    setSearchQuery(val)
    if (!isOpen) setIsOpen(true)
    // Jika user mengetik bebas di searchable input, kita juga kirimkan nilainya ke parent
    // untuk mengakomodasi kustom/pengetikan langsung.
    onChange(val)
  }

  const handleSelectOption = (opt: string) => {
    onChange(opt)
    setSearchQuery(opt)
    setIsOpen(false)
  }

  const handleSelectCustom = () => {
    if (onCustomSelect) {
      onCustomSelect()
    }
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => {
            if (!readOnly && !disabled) {
              setIsOpen(true)
              setSearchQuery('') // Kosongkan query saat fokus agar semua opsi tampil
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className="h-8 w-full rounded-md border border-slate-200 bg-white pl-8 pr-8 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-400 transition-colors disabled:opacity-50 disabled:bg-slate-50"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
          <Search className="h-3.5 w-3.5" />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!readOnly && !disabled) {
              setIsOpen(!isOpen)
            }
          }}
          disabled={disabled || readOnly}
          className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-100 bg-white py-1 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          {filteredOptions.length === 0 && !customOptionLabel ? (
            <div className="px-3 py-2 text-xs text-slate-400 italic">Tidak ada opsi ditemukan</div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`flex w-full items-center px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-50 ${
                  value === opt ? 'bg-indigo-50/50 font-semibold text-indigo-600 hover:bg-indigo-50' : 'text-slate-700'
                }`}
              >
                {opt}
              </button>
            ))
          )}

          {customOptionLabel && (
            <button
              type="button"
              onClick={handleSelectCustom}
              className="flex w-full items-center border-t border-slate-50 px-3 py-2 text-left text-xs font-semibold text-indigo-600 hover:bg-indigo-50/50 transition-colors"
            >
              {customOptionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
