import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'titleAm', title: 'Title (Amharic)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'descriptionAm', title: 'Description (Amharic)', type: 'text' }),
    defineField({ name: 'image', title: 'Image', type: 'image' }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Sort Order', name: 'sortOrderAsc', by: [{ field: 'sortOrder', direction: 'asc' }] }],
})

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'titleAm', title: 'Title (Amharic)', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'descriptionAm', title: 'Description (Amharic)', type: 'text' }),
    defineField({ name: 'price', title: 'Price (ETB)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'image', title: 'Image', type: 'image' }),
    defineField({ name: 'ingredients', title: 'Ingredients', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], validation: (r) => r.required() }),
    defineField({
      name: 'hasGranolaSizes',
      title: '1kg / 0.5kg sizes',
      type: 'boolean',
      initialValue: true,
      description: 'For granola items: let customers choose 1kg or 0.5kg (price is per kg).',
    }),
    defineField({
      name: 'featured',
      title: 'Best seller',
      type: 'boolean',
      initialValue: false,
      description: 'Shows a Best Seller badge on the menu and product page.',
    }),
    defineField({ name: 'availability', title: 'Available', type: 'boolean', initialValue: true }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number', initialValue: 0 }),
  ],
})

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'orderNumber', title: 'Order Number', type: 'string' }),
    defineField({ name: 'customerName', title: 'Customer Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'telegram',
      title: 'Telegram username',
      type: 'string',
      description: 'Customer @username (optional)',
    }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'text', validation: (r) => r.required() }),
    defineField({ name: 'notes', title: 'Notes', type: 'text' }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Name' },
          { name: 'quantity', type: 'number', title: 'Quantity' },
          { name: 'price', type: 'number', title: 'Unit Price' },
        ],
      }],
    }),
    defineField({ name: 'subtotal', title: 'Subtotal', type: 'number' }),
    defineField({ name: 'deliveryFee', title: 'Delivery Fee', type: 'number' }),
    defineField({ name: 'total', title: 'Total', type: 'number' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['pending', 'confirmed', 'delivered'],
      },
      initialValue: 'pending',
    }),
  ],
})

export const customOrder = defineType({
  name: 'customOrder',
  title: 'Custom Order',
  type: 'document',
  fields: [
    defineField({ name: 'customerName', title: 'Customer Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'telegram',
      title: 'Telegram username',
      type: 'string',
      description: 'Customer @username (optional)',
    }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'productType', title: 'Product Type', type: 'string' }),
    defineField({ name: 'quantity', title: 'Quantity', type: 'string' }),
    defineField({ name: 'preferredDate', title: 'Preferred Date', type: 'string' }),
    defineField({ name: 'deliveryOption', title: 'Delivery Option', type: 'string' }),
    defineField({ name: 'deliveryArea', title: 'Delivery Area', type: 'string' }),
    defineField({ name: 'customMessage', title: 'Custom Message', type: 'text' }),
    defineField({ name: 'flavorPreference', title: 'Flavor Preference', type: 'string' }),
    defineField({ name: 'budgetRange', title: 'Budget Range', type: 'string' }),
    defineField({ name: 'specialNotes', title: 'Special Notes', type: 'text' }),
    defineField({ name: 'attachment', title: 'Inspiration Image', type: 'image' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['pending', 'confirmed', 'delivered'],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'items',
      title: 'Final order items',
      description: 'Filled when the order is marked as delivered',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', type: 'string', title: 'Item name' },
          { name: 'quantity', type: 'number', title: 'Quantity' },
          { name: 'price', type: 'number', title: 'Unit price (ETB)' },
        ],
      }],
    }),
    defineField({ name: 'subtotal', title: 'Subtotal (ETB)', type: 'number', readOnly: true }),
    defineField({ name: 'deliveryFee', title: 'Delivery fee (ETB)', type: 'number', readOnly: true }),
    defineField({ name: 'total', title: 'Total (ETB)', type: 'number', readOnly: true }),
    defineField({ name: 'deliveredAt', title: 'Delivered at', type: 'datetime' }),
  ],
})

export const websiteImages = defineType({
  name: 'websiteImages',
  title: 'Website Images',
  type: 'document',
  fields: [
    defineField({
      name: 'slots',
      title: 'Image slots',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'websiteImageSlot',
          fields: [
            defineField({ name: 'key', title: 'Key', type: 'string' }),
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'image', title: 'Image', type: 'image' }),
          ],
          preview: {
            select: { title: 'key', media: 'image' },
          },
        },
      ],
    }),
  ],
})

export const schemaTypes = [category, menuItem, order, customOrder, websiteImages]
