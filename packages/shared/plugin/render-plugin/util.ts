export const parseStyleString = (styleString: string) => {
    return styleString.split(';').reduce((acc: any, style) => {
        const [property, value] = style.split(':').map(item => item.trim());
        if (property && value) {
            // 将CSS属性转换为驼峰命名法
            const camelCaseProperty = property.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
            acc[camelCaseProperty] = value;
        }
        return acc;
    }, {});
}