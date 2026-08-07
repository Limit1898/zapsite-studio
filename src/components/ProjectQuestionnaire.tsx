import { AnimatePresence, motion } from "framer-motion";
import { Plus, Upload, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export type ProductEntry = { name: string; price: string; file: File | null };
export type ServiceEntry = { name: string; price: string };

export type QuestionnaireState = {
  q1: string;
  q3: string[];
  q3other: string;
  q4: string;
  q4colors: string;
  q5: "" | "product" | "service";
  productCount: string;
  productCountApprox: string;
  products: ProductEntry[];
  services: ServiceEntry[];
  q6: string;
};

export const emptyQuestionnaire = (): QuestionnaireState => ({
  q1: "",
  q3: [],
  q3other: "",
  q4: "",
  q4colors: "",
  q5: "",
  productCount: "",
  productCountApprox: "",
  products: [],
  services: [{ name: "", price: "" }],
  q6: "",
});

const MAX_FILE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const fade = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.25 },
};

interface Props {
  value: QuestionnaireState;
  onChange: (v: QuestionnaireState) => void;
  errors: Record<string, boolean>;
  onFileError: (msg: string) => void;
}

export const ProjectQuestionnaire = ({ value, onChange, errors, onFileError }: Props) => {
  const { t } = useI18n();
  const q = (t.contact as any).q;
  const set = (patch: Partial<QuestionnaireState>) => onChange({ ...value, ...patch });

  const toggle = (key: "q3", opt: string) => {
    const list = value[key];
    set({ [key]: list.includes(opt) ? list.filter((o) => o !== opt) : [...list, opt] } as any);
  };

  const setProductCount = (v: string) => {
    if (v === "10+") {
      set({ productCount: v, products: [] });
      return;
    }
    const n = parseInt(v || "0", 10);
    const products = Array.from({ length: n }, (_, i) => value.products[i] || { name: "", price: "", file: null });
    set({ productCount: v, products, productCountApprox: "" });
  };

  const setProduct = (i: number, patch: Partial<ProductEntry>) => {
    const products = value.products.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    set({ products });
  };

  const pickFile = (i: number, file: File | null) => {
    if (!file) return setProduct(i, { file: null });
    if (!ACCEPTED.includes(file.type)) return onFileError(q.fileType);
    if (file.size > MAX_FILE) return onFileError(q.fileTooLarge);
    setProduct(i, { file });
  };

  const label = (n: number, text: string, required = true) => (
    <div className="text-sm font-medium mb-3">
      <span className="text-cyan me-1">{n}.</span>
      {text}
      {required && <span className="text-gold ms-1">*</span>}
    </div>
  );

  const box = (invalid?: boolean) =>
    `rounded-2xl border p-5 bg-white/[0.03] ${invalid ? "border-destructive" : "border-white/10"}`;

  const chip = (active: boolean) =>
    `flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm text-start transition-colors ${
      active ? "border-cyan bg-cyan/10 text-cyan" : "border-white/10 bg-white/5 hover:border-cyan/40"
    }`;

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{q.title}</div>

      {/* Q1 */}
      <div className={box(errors.q1)}>
        {label(1, q.q1)}
        <Input
          value={value.q1}
          onChange={(e) => set({ q1: e.target.value })}
          placeholder={q.q1ph}
          maxLength={300}
          className="bg-white/5 border-white/10 h-12 rounded-xl"
        />
      </div>

      {/* Q3 */}
      <div className={box(errors.q3)}>
        {label(2, q.q3)}
        <div className="grid sm:grid-cols-2 gap-2">
          {q.q3opts.map((opt: string) => (
            <button key={opt} type="button" onClick={() => toggle("q3", opt)} className={chip(value.q3.includes(opt))}>
              <span className={`h-4 w-4 rounded border grid place-items-center shrink-0 ${value.q3.includes(opt) ? "border-cyan bg-cyan/20" : "border-white/20"}`}>
                {value.q3.includes(opt) && <Check className="h-3 w-3" />}
              </span>
              {opt}
            </button>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {value.q3.includes(q.q3opts[8]) && (
            <motion.div {...fade} className="overflow-hidden">
              <Input
                value={value.q3other}
                onChange={(e) => set({ q3other: e.target.value })}
                placeholder={q.otherPh}
                maxLength={200}
                className="bg-white/5 border-white/10 h-12 rounded-xl mt-3"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Q4 */}
      <div className={box(errors.q4)}>
        {label(3, q.q4)}
        <div className="grid gap-2">
          {q.q4opts.map((opt: string) => (
            <button key={opt} type="button" onClick={() => set({ q4: opt })} className={chip(value.q4 === opt)}>
              {opt}
            </button>
          ))}
        </div>
        <AnimatePresence initial={false}>
          {(value.q4 === q.q4opts[0] || value.q4 === q.q4opts[1]) && (
            <motion.div {...fade} className="overflow-hidden">
              <Input
                value={value.q4colors}
                onChange={(e) => set({ q4colors: e.target.value })}
                placeholder={q.q4colorsPh}
                maxLength={200}
                className="bg-white/5 border-white/10 h-12 rounded-xl mt-3"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Q5 */}
      <div className={box(errors.q5)}>
        {label(4, q.q5)}
        <div className="grid sm:grid-cols-2 gap-3">
          {(["product", "service"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => set({ q5: k })}
              className={`h-16 rounded-xl border text-base font-medium transition-colors ${
                value.q5 === k ? "border-cyan bg-cyan/10 text-cyan" : "border-white/10 bg-white/5 hover:border-cyan/40"
              }`}
            >
              {k === "product" ? q.product : q.service}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false} mode="wait">
          {value.q5 === "product" && (
            <motion.div key="prod" {...fade} className="overflow-hidden">
              <div className="mt-4">
                <label className="text-xs text-muted-foreground mb-1.5 block">{q.productCount}</label>
                <select
                  value={value.productCount}
                  onChange={(e) => setProductCount(e.target.value)}
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-3 text-sm"
                >
                  <option value="">—</option>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((n) => (
                    <option key={n} value={n} className="bg-card">{n}</option>
                  ))}
                </select>
              </div>

              {value.productCount === "10+" ? (
                <div className="mt-3">
                  <Input
                    value={value.productCountApprox}
                    onChange={(e) => set({ productCountApprox: e.target.value })}
                    placeholder={q.tenPlusPh}
                    maxLength={50}
                    className="bg-white/5 border-white/10 h-12 rounded-xl"
                  />
                  <p className="text-xs text-gold mt-2">{q.tenPlusNote}</p>
                </div>
              ) : (
                <div className="space-y-3 mt-3">
                  {value.products.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3"
                    >
                      <div className="text-sm text-gold font-medium">{q.productLabel} {i + 1}:</div>
                      <Input
                        value={p.name}
                        onChange={(e) => setProduct(i, { name: e.target.value })}
                        placeholder={q.productNamePh}
                        maxLength={120}
                        className="bg-white/5 border-white/10 h-11 rounded-xl"
                      />
                      <Input
                        value={p.price}
                        onChange={(e) => setProduct(i, { price: e.target.value })}
                        placeholder={q.pricePh}
                        maxLength={60}
                        className="bg-white/5 border-white/10 h-11 rounded-xl"
                      />
                      <label className="flex items-center gap-3 h-11 rounded-xl border border-dashed border-white/15 bg-white/5 px-3 text-sm cursor-pointer hover:border-cyan/40 transition-colors">
                        <Upload className="h-4 w-4 text-cyan shrink-0" />
                        <span className="truncate text-muted-foreground">{p.file ? p.file.name : q.uploadImage}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => pickFile(i, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {value.q5 === "service" && (
            <motion.div key="serv" {...fade} className="overflow-hidden">
              <div className="mt-4 text-sm text-muted-foreground mb-3">{q.serviceList}</div>
              <div className="space-y-3">
                {value.services.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3 relative"
                  >
                    {value.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => set({ services: value.services.filter((_, idx) => idx !== i) })}
                        className="absolute top-3 end-3 h-7 w-7 rounded-full bg-white/5 border border-white/10 grid place-items-center hover:border-destructive hover:text-destructive transition-colors"
                        aria-label="remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <div className="text-sm text-gold font-medium">{q.serviceName} {i + 1}:</div>
                    <Input
                      value={s.name}
                      onChange={(e) => set({ services: value.services.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)) })}
                      placeholder={q.serviceNamePh}
                      maxLength={120}
                      className="bg-white/5 border-white/10 h-11 rounded-xl"
                    />
                    <Input
                      value={s.price}
                      onChange={(e) => set({ services: value.services.map((x, idx) => (idx === i ? { ...x, price: e.target.value } : x)) })}
                      placeholder={q.servicePricePh}
                      maxLength={60}
                      className="bg-white/5 border-white/10 h-11 rounded-xl"
                    />
                  </motion.div>
                ))}
              </div>
              {value.services.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => set({ services: [...value.services, { name: "", price: "" }] })}
                  className="mt-3 rounded-full border-cyan/40 text-cyan hover:bg-cyan/10 bg-transparent"
                >
                  <Plus className="h-4 w-4 me-1" />
                  {q.addService}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Q6 */}
      <div className={box(false)}>
        {label(5, q.q6, false)}
        <Input
          value={value.q6}
          onChange={(e) => set({ q6: e.target.value })}
          placeholder={q.q6ph}
          maxLength={300}
          className="bg-white/5 border-white/10 h-12 rounded-xl"
        />
        <p className="text-xs text-muted-foreground mt-2">{q.q6hint}</p>
      </div>
    </div>
  );
};
