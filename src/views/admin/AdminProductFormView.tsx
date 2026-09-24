import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, ChevronLeft, Loader2, Plus, Trash2, X } from 'lucide-react';
import type { ProductColor } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Link, useRouter } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { discountPercent, formatPrice } from '../../lib/format';
import { CATEGORY_NAMES, COLOR_SWATCHES, compareSizes, getCategory } from '../../data/catalog';
import { MAX_PHOTOS, PhotoPicker } from '../../components/admin/PhotoPicker';
import { Modal } from '../../components/common/Modal';
import { processImageFile } from '../../lib/imageUtils';
import { QuantityStepper } from '../../components/common/QuantityStepper';
import { Switch } from '../../components/common/Switch';
import { EmptyState } from '../../components/common/EmptyState';

type Field = 'images' | 'name' | 'category' | 'price';

export const AdminProductFormView: React.FC<{ productId?: string }> = ({ productId }) => {
  const { getProduct, saveProduct, deleteProduct, showToast } = useStore();
  const { navigate } = useRouter();
  const existing = productId ? getProduct(productId) : undefined;
  usePageTitle(existing ? `Edit ${existing.name}` : 'Add product');

  const [images, setImages] = useState<string[]>(existing?.images ?? []);
  const [name, setName] = useState(existing?.name ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [mrp, setMrp] = useState(existing?.mrp ? String(existing.mrp) : '');
  const [stock, setStock] = useState<Record<string, number>>(() =>
    Object.fromEntries((existing?.sizes ?? []).map((s) => [s.size, s.stock])),
  );
  const [colors, setColors] = useState<ProductColor[]>(existing?.colors ?? []);
  const [description, setDescription] = useState(existing?.description ?? '');
  const [fabric, setFabric] = useState(existing?.fabric ?? '');
  const [published, setPublished] = useState(existing?.published ?? true);
  const [isNew, setIsNew] = useState(existing?.isNew ?? !existing);
  const [isFeatured, setIsFeatured] = useState(existing?.isFeatured ?? false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [dirty, setDirty] = useState(false);
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [colorPhotoBusy, setColorPhotoBusy] = useState<number | null>(null);
  const colorFileRef = useRef<HTMLInputElement>(null);
  const colorTarget = useRef<number | null>(null);

  // Ask before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const existingSizes = useMemo(() => (existing?.sizes ?? []).map((s) => s.size), [existing]);
  const sizeRows = useMemo(() => {
    const base = category ? getCategory(category).sizes : [];
    return Array.from(new Set([...base, ...existingSizes])).sort(compareSizes);
  }, [category, existingSizes]);
  const totalUnits = sizeRows.reduce((sum, s) => sum + (stock[s] ?? 0), 0);

  if (productId && !existing) {
    return (
      <EmptyState
        title="Product not found"
        description="It may have been deleted."
        action={
          <Link to="/admin/products" className="btn btn-primary">
            Back to products
          </Link>
        }
      />
    );
  }

  const change = <T,>(setter: (v: T) => void, field?: Field) => (value: T) => {
    setter(value);
    setDirty(true);
    if (field && errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const priceNum = Number(price);
  const mrpNum = Number(mrp);
  const off = discountPercent({ price: priceNum, mrp: mrpNum });

  const updateColor = (index: number, patch: Partial<ProductColor>) =>
    change(setColors)(colors.map((c, i) => (i === index ? { ...c, ...patch } : c)));

  const addColor = (swatch: { name: string; hex: string }) => {
    if (colors.some((c) => c.name.toLowerCase() === swatch.name.toLowerCase())) return;
    change(setColors)([...colors, { ...swatch }]);
  };

  /** Camera button next to a colour: straight to camera/gallery, or a chooser if photos exist */
  const openColorPhoto = (index: number) => {
    if (images.length === 0) {
      colorTarget.current = index;
      colorFileRef.current?.click();
    } else {
      setPickerFor(index);
    }
  };

  const addColorPhoto = async (file?: File) => {
    const index = colorTarget.current;
    colorTarget.current = null;
    if (colorFileRef.current) colorFileRef.current.value = '';
    if (!file || index === null) return;
    if (images.length >= MAX_PHOTOS) {
      showToast(`You can add up to ${MAX_PHOTOS} photos.`, 'error');
      return;
    }
    setColorPhotoBusy(index);
    try {
      const url = await processImageFile(file);
      change(setImages, 'images')([...images, url]);
      change(setColors)(colors.map((c, i) => (i === index ? { ...c, image: url } : c)));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not add that photo.', 'error');
    } finally {
      setColorPhotoBusy(null);
    }
  };

  const setImagesAndFixColors = (next: string[]) => {
    change(setImages, 'images')(next);
    setColors((prev) => prev.map((c) => (c.image && !next.includes(c.image) ? { ...c, image: undefined } : c)));
  };

  const save = () => {
    const found: Partial<Record<Field, string>> = {};
    if (published && images.length === 0) found.images = 'Add at least one photo so customers can see the product.';
    if (!name.trim()) found.name = 'Enter the product name.';
    if (!category) found.category = 'Choose a category.';
    if (!(priceNum > 0)) found.price = 'Enter the selling price.';
    setErrors(found);
    const first = (['images', 'name', 'category', 'price'] as Field[]).find((f) => found[f]);
    if (first) {
      document.getElementById(`product-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const seen = new Set<string>();
    const cleanColors = colors
      .map((c) => ({ ...c, name: c.name.trim() }))
      .filter((c) => c.name && !seen.has(c.name.toLowerCase()) && seen.add(c.name.toLowerCase()));

    const saved = saveProduct(
      {
        name: name.trim(),
        category,
        price: Math.round(priceNum),
        mrp: mrpNum > priceNum ? Math.round(mrpNum) : undefined,
        images,
        description: description.trim(),
        fabric: fabric.trim() || undefined,
        colors: cleanColors,
        sizes: sizeRows
          .map((size) => ({ size, stock: stock[size] ?? 0 }))
          .filter((s) => s.stock > 0 || existingSizes.includes(s.size)),
        isNew,
        isFeatured,
        published,
      },
      existing?.id,
    );
    if (saved) {
      setDirty(false);
      navigate('/admin/products', { replace: true });
    }
  };

  const cancel = () => {
    if (dirty && !window.confirm('Leave without saving your changes?')) return;
    navigate('/admin/products');
  };

  const remove = () => {
    if (!existing) return;
    if (!window.confirm(`Delete "${existing.name}"? This cannot be undone.`)) return;
    deleteProduct(existing.id);
    navigate('/admin/products', { replace: true });
  };

  return (
    <div className="page max-w-2xl animate-fade-in pb-bar pt-4 md:pt-8">
      <button type="button" onClick={cancel} className="-ml-2 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft size={18} />
        Products
      </button>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">{existing ? 'Edit product' : 'Add a product'}</h1>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        noValidate
      >
        <FormCard title="Photos" id="product-images">
          <PhotoPicker images={images} onChange={setImagesAndFixColors} error={errors.images} />
        </FormCard>

        <FormCard title="Name & price">
          <div className="space-y-4">
            <div>
              <label htmlFor="product-name" className="label">
                Product name
              </label>
              <input
                id="product-name"
                value={name}
                onChange={(e) => change(setName, 'name')(e.target.value)}
                placeholder="e.g. Blue cotton shirt"
                className={`field ${errors.name ? 'field-error' : ''}`}
                maxLength={80}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="product-price" className="label">
                  Selling price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">₹</span>
                  <input
                    id="product-price"
                    inputMode="numeric"
                    value={price}
                    onChange={(e) => change(setPrice, 'price')(e.target.value.replace(/\D/g, '').slice(0, 7))}
                    placeholder="999"
                    className={`field tabular pl-8 ${errors.price ? 'field-error' : ''}`}
                  />
                </div>
                {errors.price && <p className="error-text">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="product-mrp" className="label">
                  MRP <span className="font-normal text-muted">(optional)</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">₹</span>
                  <input
                    id="product-mrp"
                    inputMode="numeric"
                    value={mrp}
                    onChange={(e) => change(setMrp)(e.target.value.replace(/\D/g, '').slice(0, 7))}
                    placeholder="1299"
                    className="field tabular pl-8"
                  />
                </div>
              </div>
            </div>
            {mrp && priceNum > 0 && (
              <p className={`text-sm ${off > 0 ? 'text-ok' : 'text-warn'}`}>
                {off > 0
                  ? `Customers will see ${formatPrice(mrpNum)} crossed out and ${off}% off.`
                  : 'MRP must be higher than the selling price to show a discount.'}
              </p>
            )}
          </div>
        </FormCard>

        <FormCard title="Category" id="product-category">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_NAMES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => change(setCategory, 'category')(c)}
                aria-pressed={category === c}
                className={`chip ${category === c ? 'chip-active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
          {errors.category && <p className="error-text">{errors.category}</p>}
        </FormCard>

        <FormCard title="Sizes & stock" subtitle="How many pieces do you have in each size? Leave 0 for sizes you don't have.">
          {!category ? (
            <p className="text-[15px] text-muted">Choose a category first.</p>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {sizeRows.map((size) => (
                  <li key={size} className="flex items-center justify-between gap-3 py-2">
                    <span className="text-[15px] font-semibold">{size}</span>
                    <QuantityStepper
                      value={stock[size] ?? 0}
                      onChange={(v) => change(setStock)({ ...stock, [size]: v })}
                      label={`stock for size ${size}`}
                      max={9999}
                      editable
                      size="lg"
                    />
                  </li>
                ))}
              </ul>
              <p className={`mt-2 text-sm ${totalUnits === 0 ? 'font-medium text-warn' : 'text-muted'}`}>
                {totalUnits === 0 ? 'No stock yet — this product will show as sold out.' : `${totalUnits} pieces in total`}
              </p>
            </>
          )}
        </FormCard>

        <FormCard title="Colours" subtitle="Optional. Tap to add the colours you have.">
          <div className="flex flex-wrap gap-2">
            {COLOR_SWATCHES.map((s) => {
              const added = colors.some((c) => c.name.toLowerCase() === s.name.toLowerCase());
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => addColor(s)}
                  disabled={added}
                  className={`chip pl-2 ${added ? 'opacity-40' : ''}`}
                >
                  <span className="h-6 w-6 rounded-full border border-black/15" style={{ backgroundColor: s.hex }} />
                  {s.name}
                </button>
              );
            })}
            <button type="button" onClick={() => change(setColors)([...colors, { name: '', hex: '#888888' }])} className="chip">
              <Plus size={16} />
              Other
            </button>
          </div>

          {colors.length > 0 && (
            <ul className="mt-4 space-y-2">
              {colors.map((c, i) => (
                <li key={i} className="flex items-center gap-2 rounded-xl bg-soft p-2">
                  <label className="relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-full border border-black/15" style={{ backgroundColor: c.hex }}>
                    <input
                      type="color"
                      value={/^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : '#888888'}
                      onChange={(e) => updateColor(i, { hex: e.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      aria-label={`Pick shade for ${c.name || 'colour'}`}
                    />
                  </label>
                  <input
                    value={c.name}
                    onChange={(e) => updateColor(i, { name: e.target.value })}
                    placeholder="Colour name"
                    className="field h-10 min-w-0 flex-1"
                    aria-label="Colour name"
                    autoFocus={!c.name}
                  />
                  <button
                    type="button"
                    onClick={() => openColorPhoto(i)}
                    disabled={colorPhotoBusy === i}
                    className={`relative flex h-12 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ${
                      c.image ? 'border-2 border-ink' : 'border-2 border-dashed border-line-strong bg-canvas text-muted hover:border-ink hover:text-ink'
                    }`}
                    aria-label={c.image ? `Change photos for ${c.name || 'colour'}` : `Add photos for ${c.name || 'colour'}`}
                  >
                    {colorPhotoBusy === i ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : c.image ? (
                      <img src={c.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Camera size={18} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => change(setColors)(colors.filter((_, idx) => idx !== i))}
                    className="icon-btn h-10 w-10"
                    aria-label={`Remove ${c.name || 'colour'}`}
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {colors.length > 0 && (
            <p className="hint">Tap the camera next to a colour to add its photo. Customers see it when they pick that colour.</p>
          )}
          <input
            ref={colorFileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => addColorPhoto(e.target.files?.[0])}
          />
        </FormCard>

        {pickerFor !== null && colors[pickerFor] && (
          <Modal open onClose={() => setPickerFor(null)} title={`Photo for ${colors[pickerFor].name || 'this colour'}`}>
            <div className="space-y-4 p-5">
              <button
                type="button"
                onClick={() => {
                  colorTarget.current = pickerFor;
                  setPickerFor(null);
                  colorFileRef.current?.click();
                }}
                disabled={images.length >= MAX_PHOTOS}
                className="btn btn-primary w-full"
              >
                <Camera size={18} />
                Take or choose a new photo
              </button>
              {images.length >= MAX_PHOTOS && (
                <p className="text-sm text-warn">You have {MAX_PHOTOS} photos already. Pick one below or remove a photo first.</p>
              )}
              <div>
                <p className="mb-2 text-sm font-medium text-muted">Or use a photo you already added</p>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((src, idx) => {
                    const selected = colors[pickerFor].image === src;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          updateColor(pickerFor, { image: src });
                          setPickerFor(null);
                        }}
                        aria-pressed={selected}
                        aria-label={`Use photo ${idx + 1}`}
                        className={`aspect-[3/4] overflow-hidden rounded-lg border-2 ${selected ? 'border-ink' : 'border-transparent'}`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>
              {colors[pickerFor].image && (
                <button
                  type="button"
                  onClick={() => {
                    updateColor(pickerFor, { image: undefined });
                    setPickerFor(null);
                  }}
                  className="btn btn-secondary w-full"
                >
                  Don't use a photo for this colour
                </button>
              )}
            </div>
          </Modal>
        )}

        <FormCard title="Details" subtitle="Optional, but helps customers decide.">
          <div className="space-y-4">
            <div>
              <label htmlFor="product-description" className="label">
                Description
              </label>
              <textarea
                id="product-description"
                rows={4}
                value={description}
                onChange={(e) => change(setDescription)(e.target.value)}
                placeholder="e.g. Soft cotton shirt with full sleeves. Regular fit."
                className="field"
              />
            </div>
            <div>
              <label htmlFor="product-fabric" className="label">
                Fabric
              </label>
              <input
                id="product-fabric"
                value={fabric}
                onChange={(e) => change(setFabric)(e.target.value)}
                placeholder="e.g. 100% cotton"
                className="field"
              />
            </div>
          </div>
        </FormCard>

        <FormCard title="Show in shop">
          <div className="divide-y divide-line">
            <Switch
              checked={published}
              onChange={change(setPublished, 'images')}
              label="Visible to customers"
              description={published ? 'Customers can see and buy this.' : 'Hidden. Only staff can see it.'}
            />
            <Switch checked={isNew} onChange={change(setIsNew)} label="New arrival" description="Shows a “New” label and puts it in New arrivals." />
            <Switch checked={isFeatured} onChange={change(setIsFeatured)} label="Popular" description="Shows it in “Popular right now” on the home page." />
          </div>
        </FormCard>

        {existing && (
          <button type="button" onClick={remove} className="btn btn-danger w-full">
            <Trash2 size={18} />
            Delete this product
          </button>
        )}

        {/* Save bar */}
        <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas">
          <div className="page flex max-w-2xl gap-3 py-3">
            <button type="button" onClick={cancel} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-[2]">
              {existing ? 'Save changes' : 'Save product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const FormCard: React.FC<{ title: string; subtitle?: string; id?: string; children: React.ReactNode }> = ({ title, subtitle, id, children }) => (
  <section id={id} className="card scroll-mt-20 p-4 sm:p-5">
    <h2 className="text-[17px] font-semibold">{title}</h2>
    {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
    <div className="mt-3">{children}</div>
  </section>
);
