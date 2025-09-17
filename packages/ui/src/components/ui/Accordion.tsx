import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, isValidElement, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type AccordionItem = {
  id?: string;
  title: ReactNode;
  content: string | { __html: string } | ReactNode;
};

type BaseProps = {
  items: AccordionItem[];
  className?: string;
  itemClassName?: string;
  contentClassName?: string;
};

type SingleProps = BaseProps & {
  type?: 'single';
  defaultValue?: string;
  collapsible?: boolean;
};

type MultipleProps = BaseProps & {
  type: 'multiple';
  defaultValue?: string[];
};

export type AccordionProps = SingleProps | MultipleProps;

function isHTML(c: AccordionItem['content']): c is { __html: string } {
  return !!c && typeof c === 'object' && '__html' in c && typeof (c as any).__html === 'string';
}

function Content({ content }: { content: AccordionItem['content'] }) {
  if (typeof content === 'string') return <p>{content}</p>;
  if (isValidElement(content)) return content;
  if (isHTML(content)) return <div dangerouslySetInnerHTML={content} />;
  return null;
}

type RowProps = {
  item: AccordionItem;
  id: string;
  ariaToggle: string;
  open: boolean;
  itemClassName?: string;
  contentClassName?: string;
};

const Row = memo(function Row({
  item,
  id,
  ariaToggle,
  open,
  itemClassName,
  contentClassName,
}: RowProps) {
  const transition = {
    duration: 0.32,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <AccordionPrimitive.Item value={id} className={itemClassName}>
      <AccordionPrimitive.Header className="m-0">
        <AccordionPrimitive.Trigger
          className="group flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-base font-medium outline-none ring-inset transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-400 data-[state=open]:bg-gray-50"
          aria-label={ariaToggle}
        >
          <span className="flex-1 leading-6">{item.title}</span>
          <motion.span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 bg-white"
            animate={{ rotate: open ? 180 : 0, scale: open ? 1.02 : 1 }}
            transition={transition}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content forceMount asChild>
        <motion.div
          initial={false}
          animate={open ? 'open' : 'closed'}
          variants={{ open: { height: 'auto', opacity: 1 }, closed: { height: 0, opacity: 0 } }}
          transition={transition}
          style={{ overflow: 'hidden' }}
        >
          <motion.div
            initial={false}
            animate={open ? { y: 0 } : { y: -4 }}
            transition={transition}
            className={`border-t border-gray-200 px-4 py-4 text-sm leading-6 text-gray-700 ${contentClassName ?? ''}`}
          >
            <Content content={item.content} />
          </motion.div>
        </motion.div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
});

function Multiple({
  items,
  ids,
  ariaToggle,
  className,
  itemClassName,
  contentClassName,
  defaultValue,
}: BaseProps & { ids: string[]; ariaToggle: string; defaultValue?: string[] }) {
  const [openValues, setOpenValues] = useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue.map(String) : [],
  );

  useEffect(() => {
    if (Array.isArray(defaultValue)) setOpenValues(defaultValue.map(String));
  }, [defaultValue]);

  return (
    <AccordionPrimitive.Root
      type="multiple"
      value={openValues}
      onValueChange={(v) => setOpenValues(Array.isArray(v) ? v : [])}
      className={`w-full overflow-hidden divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white ${className ?? ''}`}
    >
      {items.map((item, idx) => {
        const id = ids[idx];
        const open = openValues.includes(id);
        return (
          <Row
            key={id}
            id={id}
            item={item}
            ariaToggle={ariaToggle}
            open={open}
            itemClassName={itemClassName}
            contentClassName={contentClassName}
          />
        );
      })}
    </AccordionPrimitive.Root>
  );
}

function Single({
  items,
  ids,
  ariaToggle,
  className,
  itemClassName,
  contentClassName,
  defaultValue,
  collapsible,
}: BaseProps & {
  ids: string[];
  ariaToggle: string;
  defaultValue?: string;
  collapsible?: boolean;
}) {
  const [openValue, setOpenValue] = useState<string | undefined>(
    typeof defaultValue === 'string' ? defaultValue : undefined,
  );

  useEffect(() => {
    if (typeof defaultValue === 'string') setOpenValue(defaultValue);
  }, [defaultValue]);

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible={collapsible ?? true}
      value={openValue}
      onValueChange={(v) => setOpenValue(typeof v === 'string' ? v : undefined)}
      className={`w-full overflow-hidden divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white ${className ?? ''}`}
    >
      {items.map((item, idx) => {
        const id = ids[idx];
        const open = openValue === id;
        return (
          <Row
            key={id}
            id={id}
            item={item}
            ariaToggle={ariaToggle}
            open={open}
            itemClassName={itemClassName}
            contentClassName={contentClassName}
          />
        );
      })}
    </AccordionPrimitive.Root>
  );
}

export function Accordion(props: AccordionProps) {
  const { t } = useTranslation('ui');
  const { items, className, itemClassName, contentClassName } = props as BaseProps;
  const ids = useMemo(() => items.map((it, idx) => (it.id ? String(it.id) : String(idx))), [items]);
  const ariaToggle = t('accordion.toggle', { defaultValue: 'Toggle' });

  if (props.type === 'multiple') {
    return (
      <Multiple
        items={items}
        ids={ids}
        ariaToggle={ariaToggle}
        className={className}
        itemClassName={itemClassName}
        contentClassName={contentClassName}
        defaultValue={props.defaultValue as string[] | undefined}
      />
    );
  }

  return (
    <Single
      items={items}
      ids={ids}
      ariaToggle={ariaToggle}
      className={className}
      itemClassName={itemClassName}
      contentClassName={contentClassName}
      defaultValue={props.defaultValue as string | undefined}
      collapsible={(props as SingleProps).collapsible}
    />
  );
}

export default Accordion;
