export const COLORS = [
  {
    id: 'czerwony',
    label: 'czerwony',
    accent: '#e24a4a',
    deep: '#b52f2f',
    soft: '#fdeaea',
    ink: '#ffffff',
  },
  {
    id: 'pomaranczowy',
    label: 'pomarańczowy',
    accent: '#ed7b2f',
    deep: '#bd5a16',
    soft: '#fdefe4',
    ink: '#ffffff',
  },
  {
    id: 'zolty',
    label: 'żółty',
    accent: '#f0b429',
    deep: '#a97608',
    soft: '#fef5da',
    ink: '#493200',
  },
  {
    id: 'zielony',
    label: 'zielony',
    accent: '#3fa65b',
    deep: '#277a3e',
    soft: '#e8f6ec',
    ink: '#ffffff',
  },
  {
    id: 'niebieski',
    label: 'niebieski',
    accent: '#2f7de1',
    deep: '#1d5cb0',
    soft: '#e8f1fd',
    ink: '#ffffff',
  },
  {
    id: 'fioletowy',
    label: 'fioletowy',
    accent: '#8557d3',
    deep: '#633bb0',
    soft: '#f1eafc',
    ink: '#ffffff',
  },
  {
    id: 'rozowy',
    label: 'różowy',
    accent: '#e8579b',
    deep: '#bd3678',
    soft: '#fdeaf3',
    ink: '#ffffff',
  },
  {
    id: 'brazowy',
    label: 'brązowy',
    accent: '#9a6236',
    deep: '#744724',
    soft: '#f5ece5',
    ink: '#ffffff',
  },
]

export const DEFAULT_COLOR_ID = 'niebieski'

export function getColor(colorId) {
  return COLORS.find((color) => color.id === colorId) ?? COLORS.find((color) => color.id === DEFAULT_COLOR_ID)
}
