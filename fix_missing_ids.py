import json

def fix_missing_ids():
    with open('src/data/questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    # Simply reassign all IDs from 1 to n
    for i, question in enumerate(questions):
        question['id'] = i + 1
    
    with open('src/data/questions.json', 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Đã sửa xong! {len(questions)} câu hỏi có ID từ 1 đến {len(questions)}")

if __name__ == "__main__":
    fix_missing_ids()
