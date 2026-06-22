#!/bin/bash
# Скрипт для быстрого развертывания на GitHub Pages

echo "🚀 Wedding Website - GitHub Pages Deploy"
echo "=========================================="
echo ""

# Проверка Git
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен. Пожалуйста, установите Git."
    exit 1
fi

echo "✅ Git найден"
echo ""

# Проверка наличия файлов
if [ ! -f "index.html" ]; then
    echo "❌ index.html не найден. Пожалуйста, убедитесь, что вы в правильной папке."
    exit 1
fi

echo "✅ Необходимые файлы найдены"
echo ""

# Инициализация Git
if [ ! -d ".git" ]; then
    echo "📌 Инициализируем Git репозиторий..."
    git init
fi

echo ""
echo "📝 Введите ваш GitHub username (например: myusername):"
read username

echo ""
echo "📝 Введите ваш GitHub репозиторий (например: myusername.github.io):"
read repo

echo ""
echo "🔗 Добавляем удаленный репозиторий..."
git remote add origin https://github.com/$username/$repo.git 2>/dev/null || git remote set-url origin https://github.com/$username/$repo.git

echo ""
echo "📋 Добавляем все файлы..."
git add .

echo ""
echo "💾 Создаем коммит..."
git commit -m "Initial commit: Luxury Wedding Website"

echo ""
echo "📤 Отправляем на GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Успешно отправлено на GitHub!"
    echo ""
    echo "🎉 Ваш сайт скоро будет доступен по адресу:"
    echo "   https://$username.github.io"
    echo ""
    echo "⏳ Может потребоваться 1-2 минуты на загрузку"
else
    echo ""
    echo "❌ Ошибка при отправке на GitHub"
    echo "Убедитесь, что:"
    echo "  1. Вы правильно указали username и repo"
    echo "  2. Репозиторий существует на GitHub"
    echo "  3. У вас есть доступ в интернет"
fi
