import json
from collections import defaultdict

def check_duplicates():
    # Read the questions file
    with open('src/data/questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    # Dictionary to store question text and their IDs
    question_dict = defaultdict(list)
    
    # Check for exact duplicates
    exact_duplicates = []
    
    for question in questions:
        question_text = question['question'].strip()
        question_id = question['id']
        
        # Store question text and ID
        question_dict[question_text].append(question_id)
        
        # If we have more than one ID for the same question text, it's a duplicate
        if len(question_dict[question_text]) > 1:
            exact_duplicates.append({
                'question': question_text,
                'ids': question_dict[question_text]
            })
    
    # Print results
    print(f"Tổng số câu hỏi: {len(questions)}")
    print(f"Số câu hỏi duy nhất: {len(question_dict)}")
    print(f"Số câu hỏi trùng lặp: {len(exact_duplicates)}")
    
    if exact_duplicates:
        print("\n=== CÁC CÂU HỎI TRÙNG LẶP ===")
        for dup in exact_duplicates:
            print(f"\nCâu hỏi: {dup['question']}")
            print(f"ID trùng lặp: {dup['ids']}")
    else:
        print("\n✅ Không có câu hỏi nào trùng lặp!")
    
    # Check for similar questions (partial matches)
    print("\n=== KIỂM TRA CÂU HỎI TƯƠNG TỰ ===")
    similar_questions = []
    
    question_list = list(question_dict.keys())
    for i, q1 in enumerate(question_list):
        for j, q2 in enumerate(question_list[i+1:], i+1):
            # Check if questions are very similar (80% similarity)
            similarity = calculate_similarity(q1, q2)
            if similarity > 0.8 and similarity < 1.0:
                similar_questions.append({
                    'question1': q1,
                    'question2': q2,
                    'similarity': similarity,
                    'id1': question_dict[q1][0],
                    'id2': question_dict[q2][0]
                })
    
    if similar_questions:
        print(f"\nTìm thấy {len(similar_questions)} cặp câu hỏi tương tự:")
        for sim in similar_questions[:10]:  # Show first 10
            print(f"\nTương tự {sim['similarity']:.2%}:")
            print(f"ID {sim['id1']}: {sim['question1']}")
            print(f"ID {sim['id2']}: {sim['question2']}")
    else:
        print("Không tìm thấy câu hỏi tương tự.")

def calculate_similarity(str1, str2):
    """Calculate similarity between two strings"""
    # Simple word-based similarity
    words1 = set(str1.lower().split())
    words2 = set(str2.lower().split())
    
    if not words1 or not words2:
        return 0.0
    
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union)

if __name__ == "__main__":
    check_duplicates()
