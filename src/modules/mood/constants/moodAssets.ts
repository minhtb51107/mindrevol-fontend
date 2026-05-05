export interface MoodAsset {
    id: string;
    label: string;
    gif: string;
    themeColor: string;
}

// HỆ MÀU MỚI: Tươi sáng ở Light Mode - Sâu thẳm, rực rỡ mang vibe Vũ Trụ ở Dark Mode
const THEMES = {
    red: 'from-[#fee2e2] via-[#fef2f2] to-[#F8F9FA] dark:from-[#7f1d1d] dark:via-[#450a0a] dark:to-[#09090B]',    
    pink: 'from-[#fce7f3] via-[#fdf2f8] to-[#F8F9FA] dark:from-[#831843] dark:via-[#500724] dark:to-[#09090B]',   
    purple: 'from-[#f3e8ff] via-[#faf5ff] to-[#F8F9FA] dark:from-[#4c1d95] dark:via-[#2e1065] dark:to-[#09090B]', 
    blue: 'from-[#dbeafe] via-[#eff6ff] to-[#F8F9FA] dark:from-[#1e3a8a] dark:via-[#172554] dark:to-[#09090B]',   
    green: 'from-[#d1fae5] via-[#ecfdf5] to-[#F8F9FA] dark:from-[#064e3b] dark:via-[#022c22] dark:to-[#09090B]',  
    yellow: 'from-[#fef3c7] via-[#fffbeb] to-[#F8F9FA] dark:from-[#713f12] dark:via-[#451a03] dark:to-[#09090B]', 
    gray: 'from-[#e2e8f0] via-[#f8fafc] to-[#F8F9FA] dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#09090B]',   
}

export const MOOD_DICTIONARY: Record<string, MoodAsset> = {
    // ==========================================
    // TỨC GIẬN / QUẠU
    // ==========================================
    angry_kitty_1: { id: 'angry_kitty_1', label: 'Kitty Quạu', gif: '/Sticker/Angry Hello Kitty Sticker (1).gif', themeColor: THEMES.red },
    angry_kitty_2: { id: 'angry_kitty_2', label: 'Cáu', gif: '/Sticker/Angry Hello Kitty Sticker.gif', themeColor: THEMES.red },
    angry_office_1: { id: 'angry_office_1', label: 'Đọc CV', gif: '/Sticker/Angry Office Sticker by Sanrio Korea (1).gif', themeColor: THEMES.red },
    angry_office_2: { id: 'angry_office_2', label: 'Bùng cháy', gif: '/Sticker/Angry Office Sticker by Sanrio Korea.gif', themeColor: THEMES.red },

    // ==========================================
    // THẢ THÍNH / THẦN THÁI (KUROMI & BLING)
    // ==========================================
    bling_kuromi: { id: 'bling_kuromi', label: 'Mlem mlem', gif: '/Sticker/Bling Kuromi Sticker by Sanrio Korea.gif', themeColor: THEMES.purple },
    charm_kuromi_1: { id: 'charm_kuromi_1', label: 'Kuromi Nháy mắt', gif: '/Sticker/Charming Kuromi Sticker by Sanrio Korea (1).gif', themeColor: THEMES.purple },
    charm_kuromi_2: { id: 'charm_kuromi_2', label: 'Kuromi Thả thính', gif: '/Sticker/Charming Kuromi Sticker by Sanrio Korea (2).gif', themeColor: THEMES.purple },
    charm_kuromi_3: { id: 'charm_kuromi_3', label: 'Kuromi Dễ thương', gif: '/Sticker/Charming Kuromi Sticker by Sanrio Korea (3).gif', themeColor: THEMES.purple },
    charm_kuromi_4: { id: 'charm_kuromi_4', label: 'Kuromi Đáng yêu', gif: '/Sticker/Charming Kuromi Sticker by Sanrio Korea.gif', themeColor: THEMES.purple },
    bling_1: { id: 'bling_1', label: 'Lấp lánh 1', gif: '/Sticker/Bling Sticker by Sanrio Korea (1).gif', themeColor: THEMES.purple },
    bling_2: { id: 'bling_2', label: 'Lấp lánh 2', gif: '/Sticker/Bling Sticker by Sanrio Korea (2).gif', themeColor: THEMES.purple },
    bling_3: { id: 'bling_3', label: 'Lấp lánh 3', gif: '/Sticker/Bling Sticker by Sanrio Korea (3).gif', themeColor: THEMES.purple },
    bling_4: { id: 'bling_4', label: 'Lấp lánh 4', gif: '/Sticker/Bling Sticker by Sanrio Korea.gif', themeColor: THEMES.purple },
    star_kiki: { id: 'star_kiki', label: 'Ngôi sao Kiki', gif: '/Sticker/Star Kiki Sticker by Sanrio Korea.gif', themeColor: THEMES.purple },

    // ==========================================
    // CỰC QUẬY / PARTY / DANCE
    // ==========================================
    dance_baile_1: { id: 'dance_baile_1', label: 'Nhảy múa', gif: '/Sticker/Dance Baile Sticker (1).gif', themeColor: THEMES.yellow },
    dance_baile_2: { id: 'dance_baile_2', label: 'Quẩy lên', gif: '/Sticker/Dance Baile Sticker.gif', themeColor: THEMES.yellow },
    dance_cinna: { id: 'dance_cinna', label: 'Cinna Quẩy', gif: '/Sticker/Dance Cinnamon Sticker by Sanrio Korea.gif', themeColor: THEMES.blue },
    dance_dog_1: { id: 'dance_dog_1', label: 'Cún múa', gif: '/Sticker/Dance Dog Sticker by GONRYON._.O (1).gif', themeColor: THEMES.yellow },
    dance_dog_2: { id: 'dance_dog_2', label: 'Cún quẩy', gif: '/Sticker/Dance Dog Sticker by GONRYON._.O.gif', themeColor: THEMES.yellow },
    dance_ive: { id: 'dance_ive', label: 'Dance Ive', gif: '/Sticker/Dance Ive Sticker by GONRYON._.O.gif', themeColor: THEMES.yellow },
    dance_power: { id: 'dance_power', label: 'Bùng nổ', gif: '/Sticker/Dance Power Sticker by GONRYON._.O.gif', themeColor: THEMES.yellow },
    dance_gonryon: { id: 'dance_gonryon', label: 'Lắc nhịp', gif: '/Sticker/Dance Sticker by GONRYON._.O.gif', themeColor: THEMES.yellow },
    dance_korea_1: { id: 'dance_korea_1', label: 'Quẩy nhiệt', gif: '/Sticker/Dance   Sticker by GONRYON._.O.gif', themeColor: THEMES.yellow },
    dance_korea_2: { id: 'dance_korea_2', label: 'Sanrio Dance', gif: '/Sticker/Dance   Sticker by Sanrio Korea.gif', themeColor: THEMES.yellow },
    get_down_dance: { id: 'get_down_dance', label: 'Get Down', gif: '/Sticker/Get Down Dance Sticker by GONRYON._.O.gif', themeColor: THEMES.yellow },

    // ==========================================
    // CỰC VUI VẺ / HẠNH PHÚC (HAPPY & CUTE)
    // ==========================================
    happy_dance_1: { id: 'happy_dance_1', label: 'Vui lây 1', gif: '/Sticker/Happy Dance Sticker by GONRYON._.O (1).gif', themeColor: THEMES.yellow },
    happy_dance_2: { id: 'happy_dance_2', label: 'Vui lây 2', gif: '/Sticker/Happy Dance Sticker by GONRYON._.O (2).gif', themeColor: THEMES.yellow },
    happy_dance_3: { id: 'happy_dance_3', label: 'Vui lây 3', gif: '/Sticker/Happy Dance Sticker by GONRYON._.O (3).gif', themeColor: THEMES.yellow },
    happy_dance_4: { id: 'happy_dance_4', label: 'Vui lây 4', gif: '/Sticker/Happy Dance Sticker by GONRYON._.O.gif', themeColor: THEMES.yellow },
    happy_getdown: { id: 'happy_getdown', label: 'Happy Get Down', gif: '/Sticker/Happy Get Down Sticker by GONRYON._.O.gif', themeColor: THEMES.yellow },
    happy_happiness: { id: 'happy_happiness', label: 'Hạnh Phúc', gif: '/Sticker/Happy Happiness GIF by Sanrio.gif', themeColor: THEMES.pink },
    happy_joe_cool: { id: 'happy_joe_cool', label: 'Joe Cool Ngầu', gif: '/Sticker/Happy Joe Cool Sticker.gif', themeColor: THEMES.yellow },
    happy_sanrio: { id: 'happy_sanrio', label: 'Vui quá', gif: '/Sticker/Happy Sticker by Sanrio.gif', themeColor: THEMES.pink },
    cute_1: { id: 'cute_1', label: 'Đáng yêu 1', gif: '/Sticker/Cute Sticker by Sanrio Korea (1).gif', themeColor: THEMES.pink },
    cute_2: { id: 'cute_2', label: 'Đáng yêu 2', gif: '/Sticker/Cute Sticker by Sanrio Korea (2).gif', themeColor: THEMES.pink },
    cute_3: { id: 'cute_3', label: 'Kawaiiii', gif: '/Sticker/Cute Sticker by Sanrio Korea.gif', themeColor: THEMES.pink },
    cute_4: { id: 'cute_4', label: 'Xinh xỉu', gif: '/Sticker/Cute Sticker by Sanrio.gif', themeColor: THEMES.pink },
    good_morning: { id: 'good_morning', label: 'Chào buổi sáng', gif: '/Sticker/Good Morning Hello Sticker.gif', themeColor: THEMES.yellow },
    japan_hello: { id: 'japan_hello', label: 'Konnichiwa', gif: '/Sticker/Japan Hello Sticker by Sanrio.gif', themeColor: THEMES.pink },
    kitty_goodjob: { id: 'kitty_goodjob', label: 'Kitty Khen', gif: '/Sticker/Hello Kitty Good Job Sticker by Sanrio Korea.gif', themeColor: THEMES.pink },
    root_beer_goodjob: { id: 'root_beer_goodjob', label: 'Good Job!', gif: '/Sticker/Root Beer Good Job Sticker.gif', themeColor: THEMES.yellow },
    thank_you: { id: 'thank_you', label: 'Cảm ơn', gif: '/Sticker/Thank You Thank You Sticker by Zookiz.gif', themeColor: THEMES.pink },

    // ==========================================
    // TÌNH YÊU / HEART / MY MELODY
    // ==========================================
    heart_love: { id: 'heart_love', label: 'Tim bay', gif: '/Sticker/Heart Love Sticker.gif', themeColor: THEMES.pink },
    heart_pink_1: { id: 'heart_pink_1', label: 'Tim hồng 1', gif: '/Sticker/Heart Pink Sticker by Sanrio Korea (1).gif', themeColor: THEMES.pink },
    heart_pink_2: { id: 'heart_pink_2', label: 'Tim hồng 2', gif: '/Sticker/Heart Pink Sticker by Sanrio Korea (2).gif', themeColor: THEMES.pink },
    heart_pink_3: { id: 'heart_pink_3', label: 'Tim hồng', gif: '/Sticker/Heart Pink Sticker by Sanrio Korea.gif', themeColor: THEMES.pink },
    melody_bling: { id: 'melody_bling', label: 'Melody Bling', gif: '/Sticker/My Melody Bling Sticker by Sanrio Korea.gif', themeColor: THEMES.pink },
    melody_cat: { id: 'melody_cat', label: 'Melody Mèo', gif: '/Sticker/My Melody Cat Sticker.gif', themeColor: THEMES.pink },
    melody_cooking: { id: 'melody_cooking', label: 'Nấu ăn', gif: '/Sticker/My Melody Cooking Sticker.gif', themeColor: THEMES.pink },
    melody_korea: { id: 'melody_korea', label: 'Melody Múa', gif: '/Sticker/My Melody   Sticker by Sanrio Korea.gif', themeColor: THEMES.pink },
    thank_u_love: { id: 'thank_u_love', label: 'Yêu bạn', gif: '/Sticker/Thank U Love Sticker.gif', themeColor: THEMES.pink },

    // ==========================================
    // CỰC CHILL / NGỦ / CHÁN / BUỒN
    // ==========================================
    chillguy: { id: 'chillguy', label: 'Chill thôi', gif: '/Sticker/Chill Chillguy Sticker by GONRYON._.O.gif', themeColor: THEMES.blue },
    cinna_1: { id: 'cinna_1', label: 'Cinnamon 1', gif: '/Sticker/Cinnamon Sticker by Sanrio Korea (1).gif', themeColor: THEMES.blue },
    cinna_2: { id: 'cinna_2', label: 'Cinnamon 2', gif: '/Sticker/Cinnamon Sticker by Sanrio Korea (2).gif', themeColor: THEMES.blue },
    cinna_3: { id: 'cinna_3', label: 'Cinnamon 3', gif: '/Sticker/Cinnamon Sticker by Sanrio Korea.gif', themeColor: THEMES.blue },
    kitty_sleep_1: { id: 'kitty_sleep_1', label: 'Kitty Khò khò', gif: '/Sticker/Hello Kitty Sleeping Sticker (1).gif', themeColor: THEMES.gray },
    kitty_sleep_2: { id: 'kitty_sleep_2', label: 'Mắt nhắm', gif: '/Sticker/Hello Kitty Sleeping Sticker.gif', themeColor: THEMES.gray },
    melody_crying: { id: 'melody_crying', label: 'Khóc nhè', gif: '/Sticker/My Melody Crying Sticker.gif', themeColor: THEMES.blue },
    bored: { id: 'bored', label: 'Chán quá', gif: '/Sticker/Bored Sticker by Zookiz.gif', themeColor: THEMES.gray },
    scared: { id: 'scared', label: 'Sợ hãi', gif: '/Sticker/Scared Sticker by Zookiz.gif', themeColor: THEMES.gray },
    sad_dance: { id: 'sad_dance', label: 'Khóc trong mưa', gif: '/Sticker/Sad Dance Sticker by GONRYON._.O.gif', themeColor: THEMES.blue },
    sad_dog: { id: 'sad_dog', label: 'Cún Buồn', gif: '/Sticker/Sad Dog Sticker by GONRYON._.O.gif', themeColor: THEMES.blue },
    suspicious: { id: 'suspicious', label: 'Đáng ngờ...', gif: '/Sticker/Suspicious Sospechoso Sticker.gif', themeColor: THEMES.gray },

    // ==========================================
    // NHÓM SNOOPY / POCHACCO / ĐỘNG VẬT
    // ==========================================
    pochacco_1: { id: 'pochacco_1', label: 'Pochacco', gif: '/Sticker/Pochacco Sticker by Sanrio Korea.gif', themeColor: THEMES.green },
    pochacco_2: { id: 'pochacco_2', label: 'Pochacco Múa 1', gif: '/Sticker/Pochacco   Sticker by Sanrio Korea (1).gif', themeColor: THEMES.green },
    pochacco_3: { id: 'pochacco_3', label: 'Pochacco Múa 2', gif: '/Sticker/Pochacco   Sticker by Sanrio Korea.gif', themeColor: THEMES.green },
    pochacco_frame: { id: 'pochacco_frame', label: 'Khung Pochacco', gif: '/Sticker/Frame Pochacco Sticker by Sanrio Korea.gif', themeColor: THEMES.green },
    esnupi_chef: { id: 'esnupi_chef', label: 'Snoopy Đầu bếp', gif: '/Sticker/Chef Esnupi Sticker.gif', themeColor: THEMES.yellow },
    esnupi_ok: { id: 'esnupi_ok', label: 'Snoopy OK', gif: '/Sticker/Esnupi Ok Sticker.gif', themeColor: THEMES.green },
    esnupi_wow: { id: 'esnupi_wow', label: 'Snoopy Wow', gif: '/Sticker/Esnupi Wow Sticker.gif', themeColor: THEMES.yellow },
    woodstock: { id: 'woodstock', label: 'Woodstock', gif: '/Sticker/Woodstock Esnupi Sticker.gif', themeColor: THEMES.yellow },
    dog_look: { id: 'dog_look', label: 'Cún Ngó', gif: '/Sticker/Dog Look Sticker (1).gif', themeColor: THEMES.yellow },
    dog_pregunta: { id: 'dog_pregunta', label: 'Cún Hỏi Chấm', gif: '/Sticker/Dog Pregunta Sticker.gif', themeColor: THEMES.yellow },
    dog_japan: { id: 'dog_japan', label: 'Cún Japan', gif: '/Sticker/Dog Japan Sticker by Sanrio.gif', themeColor: THEMES.yellow },

    // ==========================================
    // LỄ HỘI / SỰ KIỆN / EVENT
    // ==========================================
    anni_sanrio: { id: 'anni_sanrio', label: 'Kỷ niệm', gif: '/Sticker/Anniversary Sticker by Sanrio.gif', themeColor: THEMES.pink },
    hbd_congrats: { id: 'hbd_congrats', label: 'Chúc mừng SN', gif: '/Sticker/Happy Birthday Congrats Sticker.gif', themeColor: THEMES.yellow },
    hbd_sanrio: { id: 'hbd_sanrio', label: 'Sinh nhật Sanrio', gif: '/Sticker/Sticker Birthday Sticker by Sanrio.gif', themeColor: THEMES.pink },
    cake_sanrio: { id: 'cake_sanrio', label: 'Bánh kem', gif: '/Sticker/Sticker Cake Sticker by Sanrio.gif', themeColor: THEMES.pink },
    merry_christmas: { id: 'merry_christmas', label: 'Giáng sinh', gif: '/Sticker/Merry Christmas Sticker.gif', themeColor: THEMES.red },
    kendrick_bowl: { id: 'kendrick_bowl', label: 'Superbowl', gif: '/Sticker/Kendrick Lamar Superbowl Sticker by GONRYON._.O.gif', themeColor: THEMES.gray },

    // ==========================================
    // NHÓM PIXEL ART & LINH TINH (MISC)
    // ==========================================
    cat_pixel: { id: 'cat_pixel', label: 'Mèo Pixel', gif: '/Sticker/Cat Pixel Sticker.gif', themeColor: THEMES.gray },
    melody_pixel_1: { id: 'melody_pixel_1', label: 'Melody Pixel 1', gif: '/Sticker/My Melody Pixel Sticker (1).gif', themeColor: THEMES.pink },
    melody_pixel_2: { id: 'melody_pixel_2', label: 'Melody Pixel 2', gif: '/Sticker/My Melody Pixel Sticker.gif', themeColor: THEMES.pink },
    pixel_art: { id: 'pixel_art', label: 'Pixel Vui', gif: '/Sticker/Pixel Art Sticker.gif', themeColor: THEMES.yellow },
    pixel_hearts: { id: 'pixel_hearts', label: 'Tim Pixel', gif: '/Sticker/Pixel Hearts Sticker.gif', themeColor: THEMES.pink },
    arrow_click: { id: 'arrow_click', label: 'Nhấp nháy', gif: '/Sticker/Arrow Click Sticker by Sanrio Korea.gif', themeColor: THEMES.yellow },
    melody_click: { id: 'melody_click', label: 'Melody Click', gif: '/Sticker/Click My Melody Sticker by Sanrio Korea.gif', themeColor: THEMES.pink },
    office_char: { id: 'office_char', label: 'Nhân viên VP', gif: '/Sticker/Office Character Sticker by Sanrio Korea.gif', themeColor: THEMES.blue },
    pink_korea: { id: 'pink_korea', label: 'Korea Pink', gif: '/Sticker/Pink Sticker by Sanrio Korea.gif', themeColor: THEMES.pink },
    pink_sanrio: { id: 'pink_sanrio', label: 'Sanrio Pink', gif: '/Sticker/Pink Sticker Sticker by Sanrio.gif', themeColor: THEMES.pink },
    twin_stars: { id: 'twin_stars', label: 'Little Twin Stars', gif: '/Sticker/Little Twin Stars Sticker by Sanrio Korea.gif', themeColor: THEMES.purple },
    kitty_korea: { id: 'kitty_korea', label: 'Kitty Korea', gif: '/Sticker/Hello Kitty Sticker by Sanrio Korea.gif', themeColor: THEMES.pink },
    window_sparkle: { id: 'window_sparkle', label: 'Cửa sổ lấp lánh', gif: '/Sticker/Window   Sticker by Sanrio Korea.gif', themeColor: THEMES.blue },

    // Các file đánh số (Gif 1 -> 5)
    gif_1: { id: 'gif_1', label: 'Icon 1', gif: '/Sticker/1.gif', themeColor: THEMES.gray },
    gif_2: { id: 'gif_2', label: 'Icon 2', gif: '/Sticker/2.gif', themeColor: THEMES.gray },
    gif_3: { id: 'gif_3', label: 'Icon 3', gif: '/Sticker/3.gif', themeColor: THEMES.gray },
    gif_4: { id: 'gif_4', label: 'Icon 4', gif: '/Sticker/4.gif', themeColor: THEMES.gray },
    gif_5: { id: 'gif_5', label: 'Icon 5', gif: '/Sticker/gif (1).gif', themeColor: THEMES.gray },
    gif_6: { id: 'gif_6', label: 'Icon 6', gif: '/Sticker/gif (2).gif', themeColor: THEMES.gray },
    gif_7: { id: 'gif_7', label: 'Icon 7', gif: '/Sticker/gif (3).gif', themeColor: THEMES.gray },
    gif_8: { id: 'gif_8', label: 'Icon 8', gif: '/Sticker/gif (4).gif', themeColor: THEMES.gray },
    gif_9: { id: 'gif_9', label: 'Icon 9', gif: '/Sticker/gif (5).gif', themeColor: THEMES.gray },
    gif_10: { id: 'gif_10', label: 'Icon 10', gif: '/Sticker/gif.gif', themeColor: THEMES.gray },

    // ==========================================
    // MẶC ĐỊNH
    // ==========================================
    default: { id: 'default', label: 'Bình thường', gif: '/Sticker/Chill Chillguy Sticker by GONRYON._.O.gif', themeColor: 'from-[#f3e8ff] via-[#faf5ff] to-[#F8F9FA] dark:from-[#4c1d95] dark:via-[#2e1065] dark:to-[#09090B]' }
}

export const MOOD_LIST = Object.values(MOOD_DICTIONARY).filter(m => m.id !== 'default');