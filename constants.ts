import { TarotCard, Category } from './types';
import { Heart, Stethoscope, Coins, Briefcase, Home, GraduationCap } from 'lucide-react';

export const MAJOR_ARCANA: TarotCard[] = [
  { 
    id: 0, 
    name: '愚者', 
    nameEn: 'The Fool', 
    meaningUpright: '開始、自由、純真', 
    meaningReversed: '魯莽、冒險',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg'
  },
  { 
    id: 1, 
    name: '魔術師', 
    nameEn: 'The Magician', 
    meaningUpright: '創造力、技能、意志力', 
    meaningReversed: '欺騙、混亂',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg'
  },
  { 
    id: 2, 
    name: '女祭司', 
    nameEn: 'The High Priestess', 
    meaningUpright: '直覺、神秘、潛意識', 
    meaningReversed: '秘密被揭露',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg'
  },
  { 
    id: 3, 
    name: '皇后', 
    nameEn: 'The Empress', 
    meaningUpright: '豐饒、母性、自然', 
    meaningReversed: '依賴、空虛',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg'
  },
  { 
    id: 4, 
    name: '皇帝', 
    nameEn: 'The Emperor', 
    meaningUpright: '權威、結構、父親形象', 
    meaningReversed: '專制、僵化',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg'
  },
  { 
    id: 5, 
    name: '教皇', 
    nameEn: 'The Hierophant', 
    meaningUpright: '傳統、精神引導、信仰', 
    meaningReversed: '反叛、束縛',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg'
  },
  { 
    id: 6, 
    name: '戀人', 
    nameEn: 'The Lovers', 
    meaningUpright: '愛、和諧、選擇', 
    meaningReversed: '不和、分離',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg'
  },
  { 
    id: 7, 
    name: '戰車', 
    nameEn: 'The Chariot', 
    meaningUpright: '勝利、決心、行動', 
    meaningReversed: '失控、失敗',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg'
  },
  { 
    id: 8, 
    name: '力量', 
    nameEn: 'Strength', 
    meaningUpright: '勇氣、耐心、同情', 
    meaningReversed: '軟弱、自我懷疑',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg'
  },
  { 
    id: 9, 
    name: '隱士', 
    nameEn: 'The Hermit', 
    meaningUpright: '內省、孤獨、指引', 
    meaningReversed: '孤立、迷失',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg'
  },
  { 
    id: 10, 
    name: '命運之輪', 
    nameEn: 'Wheel of Fortune', 
    meaningUpright: '變化、週期、運氣', 
    meaningReversed: '厄運、抵抗變化',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg'
  },
  { 
    id: 11, 
    name: '正義', 
    nameEn: 'Justice', 
    meaningUpright: '公正、真理、法律', 
    meaningReversed: '不公、偏見',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg'
  },
  { 
    id: 12, 
    name: '吊人', 
    nameEn: 'The Hanged Man', 
    meaningUpright: '犧牲、放手、新視角', 
    meaningReversed: '停滯、無謂犧牲',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg'
  },
  { 
    id: 13, 
    name: '死神', 
    nameEn: 'Death', 
    meaningUpright: '結束、轉變、重生', 
    meaningReversed: '恐懼改變、停滯',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg'
  },
  { 
    id: 14, 
    name: '節制', 
    nameEn: 'Temperance', 
    meaningUpright: '平衡、節制、目的', 
    meaningReversed: '失衡、過度',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg'
  },
  { 
    id: 15, 
    name: '惡魔', 
    nameEn: 'The Devil', 
    meaningUpright: '束縛、物質主義、誘惑', 
    meaningReversed: '打破束縛、重獲自由',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg'
  },
  { 
    id: 16, 
    name: '塔', 
    nameEn: 'The Tower', 
    meaningUpright: '災難、劇變、啟示', 
    meaningReversed: '避免災難、恐懼',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg'
  },
  { 
    id: 17, 
    name: '星星', 
    nameEn: 'The Star', 
    meaningUpright: '希望、靈感、寧靜', 
    meaningReversed: '絕望、缺乏信心',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg'
  },
  { 
    id: 18, 
    name: '月亮', 
    nameEn: 'The Moon', 
    meaningUpright: '幻覺、恐懼、潛意識', 
    meaningReversed: '釋放恐懼、清晰',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg'
  },
  { 
    id: 19, 
    name: '太陽', 
    nameEn: 'The Sun', 
    meaningUpright: '快樂、成功、活力', 
    meaningReversed: '暫時的憂鬱',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg'
  },
  { 
    id: 20, 
    name: '審判', 
    nameEn: 'Judgment', 
    meaningUpright: '重生、召喚、寬恕', 
    meaningReversed: '自我懷疑、拒絕',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg'
  },
  { 
    id: 21, 
    name: '世界', 
    nameEn: 'The World', 
    meaningUpright: '完成、整合、旅行', 
    meaningReversed: '未完成、缺乏閉環',
    image: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg'
  },
];

export const CATEGORY_CONFIG = {
  [Category.LOVE]: { 
    icon: Heart, 
    color: 'text-rose-400', 
    desc: '感情關係、桃花運勢',
    placeholder: '例如：我與心儀對象會有發展嗎？最近的桃花運如何？我們這段關係的未來走向？'
  },
  [Category.HEALTH]: { 
    icon: Stethoscope, 
    color: 'text-emerald-400', 
    desc: '身心狀態、能量平衡',
    placeholder: '例如：最近身心靈狀態如何？有什麼需要注意的健康隱憂？如何改善目前的睡眠品質？'
  },
  [Category.WEALTH]: { 
    icon: Coins, 
    color: 'text-yellow-400', 
    desc: '財務狀況、投資運勢',
    placeholder: '例如：近期的財運如何？適合現在進行投資或創業嗎？如何突破目前的財務瓶頸？'
  },
  [Category.CAREER]: { 
    icon: Briefcase, 
    color: 'text-blue-400', 
    desc: '工作發展、職場人際',
    placeholder: '例如：目前的工作有發展前景嗎？近期適合轉職嗎？如何在職場上獲得突破？'
  },
  [Category.FAMILY]: { 
    icon: Home, 
    color: 'text-orange-400', 
    desc: '家庭和諧、親屬關係',
    placeholder: '例如：如何改善與父母的溝通？家庭氣氛最近會如何變化？這件事對家人的影響為何？'
  },
  [Category.EDUCATION]: { 
    icon: GraduationCap, 
    color: 'text-purple-400', 
    desc: '學業考試、進修深造',
    placeholder: '例如：這次考試的運勢如何？適合出國深造嗎？目前的學習方向正確嗎？'
  },
};