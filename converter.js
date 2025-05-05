/**
 * iOS 無障礙元素格式轉換工具
 * 
 * 此工具用於將不同格式的iOS無障礙元素JSON轉換為統一格式
 */

// 通用轉換函數
function convertToUnifiedFormat(inputData, formatType) {
    if (formatType === 'format1') {
        return convertFormat1(inputData);
    } else if (formatType === 'format2') {
        return convertFormat2(inputData);
    } else {
        throw new Error('不支援的格式類型');
    }
}

/**
 * 將Format 1轉換為統一格式
 * Format 1為扁平數組結構，需要構建層次關係
 */
function convertFormat1(inputData) {
    // 檢查輸入數據是否為數組
    if (!Array.isArray(inputData)) {
        throw new Error('Format 1必須是數組類型');
    }

    // 預處理：為每個元素分配唯一ID（如果沒有的話）
    const elementsWithId = inputData.map((element, index) => {
        return {
            ...element,
            id: element.AXUniqueId || `element_${index}`
        };
    });

    // 推斷元素關係（這裡我們假設第一個元素是根元素）
    const rootElement = elementsWithId[0];
    const otherElements = elementsWithId.slice(1);

    // 首先嘗試根據框架位置建立父子關係
    rootElement.children = [];
    otherElements.forEach(element => {
        // 簡單起見，我們將其他元素都作為根元素的子元素
        rootElement.children.push({
            ...element,
            children: []
        });
    });

    // 創建統一格式輸出
    const unifiedOutput = {
        elements: [
            {
                id: rootElement.id,
                frame: rootElement.frame,
                type: rootElement.type,
                role: rootElement.role,
                role_description: rootElement.role_description,
                label: rootElement.AXLabel,
                value: rootElement.AXValue,
                enabled: rootElement.enabled,
                help: rootElement.help,
                custom_actions: rootElement.custom_actions,
                children: rootElement.children.map(child => convertElementToUnified(child))
            }
        ],
        metadata: {
            app_name: rootElement.AXLabel || "未知應用",
            device_info: "iPhone",
            screen_size: {
                width: rootElement.frame.width,
                height: rootElement.frame.height
            },
            timestamp: new Date().toISOString()
        }
    };

    return unifiedOutput;
}

/**
 * 將Format 2轉換為統一格式
 * Format 2為嵌套層次結構，需要提取關鍵信息
 */
function convertFormat2(inputData) {
    // 檢查輸入數據格式
    if (!inputData.content || !Array.isArray(inputData.content)) {
        throw new Error('Format 2必須包含content數組');
    }

    // 獲取根元素
    const rootElement = inputData.content[0]?.text?.[0];
    if (!rootElement) {
        throw new Error('找不到根元素');
    }

    // 將其轉換為統一格式
    const unifiedOutput = {
        elements: [convertElementToUnified(rootElement)],
        metadata: {
            app_name: rootElement.AXLabel || "未知應用",
            device_info: "iPhone",
            screen_size: {
                width: rootElement.frame.width,
                height: rootElement.frame.height
            },
            timestamp: new Date().toISOString()
        }
    };

    return unifiedOutput;
}

/**
 * 輔助函數：將單個元素轉換為統一格式
 */
function convertElementToUnified(element) {
    const unifiedElement = {
        id: element.AXUniqueId || element.id || `gen_${Math.random().toString(36).substr(2, 9)}`,
        frame: element.frame,
        type: element.type,
        role: element.role,
        role_description: element.role_description,
        label: element.AXLabel,
        value: element.AXValue,
        enabled: element.enabled,
        help: element.help,
        custom_actions: element.custom_actions || []
    };

    // 處理子元素
    if (element.children && element.children.length > 0) {
        unifiedElement.children = element.children.map(child => convertElementToUnified(child));
    } else {
        unifiedElement.children = [];
    }

    return unifiedElement;
}

// 如果在Node.js環境中運行，導出這些函數
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertToUnifiedFormat,
        convertFormat1,
        convertFormat2
    };
} 