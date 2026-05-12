// Status Enums
export const ROUTE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DRAFT: 'DRAFT',
  SUSPENDED: 'SUSPENDED'
}

export const STATUS_COLORS = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  DRAFT: 'warning',
  SUSPENDED: 'danger'
}

export const STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DRAFT: 'Draft',
  SUSPENDED: 'Suspended'
}

export const STATUS_OPTIONS = Object.entries(ROUTE_STATUS).map(([key, value]) => ({
  value,
  label: STATUS_LABELS[value]
}))
