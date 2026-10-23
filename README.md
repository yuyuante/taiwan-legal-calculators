# 臺灣法律計算工具

以原生 HTML、CSS 與 JavaScript 製作的臺灣法律實用計算器集合。

## 計算器

### 刑事上訴期限計算器

依刑事訴訟法第 65、349 條及民法第 120、122 條，從判決送達日計算 20 日上訴期間，並處理週末與國定假日順延。

- [程式碼](./criminal-appeal-deadline/dist/index.html)
- [線上使用](https://criminal-appeal-deadline.sweetring4097.chatgpt.site)

### 法定遲延利息計算器

依民法第 203 條、第 233 條第 1 項，以週年利率 5% 計算遲延利息；跨年度會依平年 365 日、閏年 366 日分段計算，合計後四捨五入至元。

- [程式碼](./statutory-default-interest-calculator/dist/index.html)
- [線上使用](https://statutory-default-interest-calculator.sweetring4097.chatgpt.site)

## 本機驗證

```powershell
node criminal-appeal-deadline/verify.mjs
node statutory-default-interest-calculator/verify.mjs
```

## 免責聲明

本專案僅供一般資訊與初步試算，不構成法律意見。期限、利率與起算日可能因個案事實、契約或特別法律而異，重要案件請向法院或合格法律專業人士確認。

