# Localization

## Basics

Use the `useTranslate()` hook for localization. This string will automatically be swapped out for the localized version based on the user's language preferences.

```json
{
  "hello": "Hello"
}
```

```javascript
const translate = useTranslate();
translate('hello');
```

Variables can be specified in the string using `{{}}`, with the values specified in an object.

```json
{
  "hello-message": "Hello {{name}}, you have {{message}} messages."
}
```

```javascript
const translate = useTranslate();
const name = user.firstName;
const numMessages = messages.length;

translate('hello-message', {
  name,
  messages: numMessages,
});
```

Variable names must only contain case-sensitive alphanumeric characters (a-z, A-Z, and 0-9) and should be meaningful to provide better context for translators. Typically, we use `camelCase` for consistency.

You can insert components using the `Trans` component.

```json
{
  "hello-with-link": "Hello {{name}} <link />"
}
```

```jsx
const someComponent = <a href="https://www.geekup.vn">https://www.geekup.vn</a>;
const name = user.firstName;

return (
  <Trans
    i18nKey={'hello-with-link'}
    values={{ name }}
    components={{ link: someComponent }}
  />
);
```

## Localization best practices

### Avoid sentence fragments

Translators need context to translate sentences correctly. Avoid translating fragments of sentences.

```json
{
  "allow": "Allow time for ",
  "redaction": "the redaction to finish.",
  "video": "the video to process."
}
```

```javascript
const translate = useTranslate();
const allow = translate('allow');
const redaction = translate('redaction');
const video = translate('video');
return isRedaction ? allow + redaction : allow + video;
```

In this example, the translators will see three separate fragments of a sentence, not knowing they go together. It's very unlikely the translated fragments will recombine without error.

You can easily avoid this issue by using localization strings with more context. Don't worry about the cost to translate these, it's more important that the translations are correct.

```json
{
  "allow-finish": "Allow time for the redaction to finish.",
  "allow-process": "Allow time for the video to process."
}
```

```javascript
const translate = useTranslate();
return isRedaction ? translate('allow-finish') : translate('allow-process');
```

### Don't split units and values

Include all parts of a phrase in the localization string.

Instead of

```json
{
  "meters-sound": "meters/second"
}
```

```javascript
const translate = useTranslate();
const speedString = speed + ' ' + translate('meters-sound');
```

do

```json
{
  "meters-sound": "{{speed}} meters/second"
}
```

```javascript
const translate = useTranslate();
const speedString = translate('meters-sound', { speed });
```

Use multiple strings for plurals.

```json
{
  "key1_one": "{{count}} item",
  "key1_other": "{{count}} items",
  "key1_interval": "(1)[one item];(2-7)[a few items];(7-inf)[a lot of items];",
  "key2_one": "{{count}} item",
  "key2_other": "{{count}} items",
  "key2_interval": "(1)[one item];(2-7)[a few items];"
}
```

```javascript
const translate = useTranslate();
translate('key1_interval', { postProcess: 'interval', count: 1 }); // -> "one item"
translate('key1_interval', { postProcess: 'interval', count: 4 }); // -> "a few items"
translate('key1_interval', {
  postProcess: 'interval',
  count: 100,
}); // -> "a lot of items"

// not matching into a range it will fallback to
// the regular plural form
translate('key2_interval', { postProcess: 'interval', count: 1 }); // -> "one item"
translate('key2_interval', { postProcess: 'interval', count: 4 }); // -> "a few items"
translate('key2_interval', { postProcess: 'interval', count: 100 }); // -> "100 items"
```

Technically, languages like French would also need a different string when there are 0 items, but we don't usually worry about that level of accuracy.

#### Product Names

Product names are part of the brand and so generally should not be individually translated.

```javascript
const companyName = 'GEEKUp';
```

However, they _should_ be translated when part of a larger sentence.

```json
{
  "large-sentence": "Allows a user to log in to GEEKUp website."
}
```

```javascript
const translate = useTranslate();
translate('large-sentence');
```

#### Use Excel template

To reduce mistake and easy to manage then JSON translation file, we should use an Excel template (ref: Translate Template.xlsx). Recommend upload this file to Google Drive or Office 365 for easy to collab (https://docs.google.com/spreadsheets/d/12ftmWSuU0KswSHvo-WVGK7J5dvhu6IYgGkKuHrtpH5k/edit?usp=sharing)

Process:

1. When we got new term need to translate, insert a record in template file, and input the `Key`, `Description`.
2. Then you or client will input the translated term in `EN` and `VI` (you can insert more languages).
3. Then column right after `EN` and `VI` will be generated automatically.
4. Copy that column to the JSON file in your source code.

Note: In case you devide into multiple translation file (commond.json, auth.json, investor.json...), you can create multiple sheet in the template file. Each Sheet contain terms of each translation file.

With this method, both Web and Mobile can use the same file. Client have to translate once.
