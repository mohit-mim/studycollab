// Code Templates Library
const CodeTemplates = {
    javascript: {
        'Basic Function': {
            code: "function myFunction(param) {\n    // Your code here\n    return param;\n}",
            description: "Basic function template"
        },
        'Arrow Function': {
            code: "const myFunction = (param) => {\n    // Your code here\n    return param;\n};",
            description: "ES6 arrow function"
        },
        'Async Function': {
            code: "async function fetchData(url) {\n    try {\n        const response = await fetch(url);\n        const data = await response.json();\n        return data;\n    } catch (error) {\n        console.error('Error:', error);\n    }\n}",
            description: "Async/await function template"
        },
        'Class': {
            code: "class MyClass {\n    constructor(name) {\n        this.name = name;\n    }\n\n    greet() {\n        console.log(`Hello, ${this.name}!`);\n    }\n}",
            description: "ES6 class template"
        },
        'Event Listener': {
            code: "document.getElementById('myElement').addEventListener('click', (event) => {\n    // Handle click event\n    console.log('Element clicked!', event);\n});",
            description: "DOM event listener"
        },
        'For Loop': {
            code: "for (let i = 0; i < array.length; i++) {\n    console.log(array[i]);\n}",
            description: "Standard for loop"
        },
        'Array Methods': {
            code: "const numbers = [1, 2, 3, 4, 5];\n\n// Map\nconst doubled = numbers.map(n => n * 2);\n\n// Filter\nconst evens = numbers.filter(n => n % 2 === 0);\n\n// Reduce\nconst sum = numbers.reduce((acc, n) => acc + n, 0);",
            description: "Common array methods"
        }
    },

    python: {
        'Basic Function': {
            code: "def my_function(param):\n    \"\"\"Function description\"\"\"\n    # Your code here\n    return param",
            description: "Basic function template"
        },
        'Class': {
            code: "class MyClass:\n    def __init__(self, name):\n        self.name = name\n    \n    def greet(self):\n        print(f\"Hello, {self.name}!\")",
            description: "Python class template"
        },
        'List Comprehension': {
            code: "# List comprehension\nsquares = [x**2 for x in range(10)]\n\n# With condition\nevens = [x for x in range(10) if x % 2 == 0]",
            description: "List comprehension examples"
        },
        'Try-Except': {
            code: "try:\n    # Code that might raise an exception\n    result = risky_operation()\nexcept Exception as e:\n    print(f\"Error occurred: {e}\")\nfinally:\n    print(\"Cleanup code\")",
            description: "Exception handling"
        },
        'File I/O': {
            code: "# Read file\nwith open('file.txt', 'r') as file:\n    content = file.read()\n\n# Write file\nwith open('output.txt', 'w') as file:\n    file.write('Hello, World!')",
            description: "File reading and writing"
        },
        'Decorator': {
            code: "def my_decorator(func):\n    def wrapper(*args, **kwargs):\n        print(\"Before function call\")\n        result = func(*args, **kwargs)\n        print(\"After function call\")\n        return result\n    return wrapper\n\n@my_decorator\ndef say_hello(name):\n    print(f\"Hello, {name}!\")",
            description: "Python decorator pattern"
        }
    },

    cpp: {
        'Basic Program': {
            code: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}",
            description: "Basic C++ program"
        },
        'Class': {
            code: "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass MyClass {\nprivate:\n    string name;\npublic:\n    MyClass(string n) : name(n) {}\n    \n    void greet() {\n        cout << \"Hello, \" << name << \"!\" << endl;\n    }\n};",
            description: "C++ class template"
        },
        'Vector': {
            code: "#include <vector>\n#include <iostream>\nusing namespace std;\n\nint main() {\n    vector<int> numbers = {1, 2, 3, 4, 5};\n    \n    for(int num : numbers) {\n        cout << num << \" \";\n    }\n    return 0;\n}",
            description: "Using STL vector"
        },
        'Function': {
            code: "int add(int a, int b) {\n    return a + b;\n}\n\ntemplate<typename T>\nT max(T a, T b) {\n    return (a > b) ? a : b;\n}",
            description: "Function and template function"
        }
    },

    html: {
        'HTML5 Boilerplate': {
            code: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 0;\n            padding: 20px;\n        }\n    </style>\n</head>\n<body>\n    <h1>Hello World</h1>\n    <script>\n        console.log('Page loaded');\n    </script>\n</body>\n</html>",
            description: "HTML5 boilerplate"
        },
        'Form': {
            code: "<form action=\"/submit\" method=\"POST\">\n    <label for=\"name\">Name:</label>\n    <input type=\"text\" id=\"name\" name=\"name\" required>\n    \n    <label for=\"email\">Email:</label>\n    <input type=\"email\" id=\"email\" name=\"email\" required>\n    \n    <button type=\"submit\">Submit</button>\n</form>",
            description: "HTML form template"
        },
        'Card Component': {
            code: "<div class=\"card\">\n    <img src=\"image.jpg\" alt=\"Card image\">\n    <div class=\"card-body\">\n        <h3>Card Title</h3>\n        <p>Card description goes here.</p>\n        <button>Learn More</button>\n    </div>\n</div>\n\n<style>\n.card {\n    border: 1px solid #ddd;\n    border-radius: 8px;\n    overflow: hidden;\n    max-width: 300px;\n}\n.card img {\n    width: 100%;\n    height: 200px;\n    object-fit: cover;\n}\n.card-body {\n    padding: 16px;\n}\n</style>",
            description: "Card component"
        }
    },

    java: {
        'Basic Program': {
            code: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
            description: "Basic Java program"
        },
        'Class': {
            code: "public class MyClass {\n    private String name;\n    \n    public MyClass(String name) {\n        this.name = name;\n    }\n    \n    public String getName() {\n        return name;\n    }\n    \n    public void setName(String name) {\n        this.name = name;\n    }\n    \n    public void greet() {\n        System.out.println(\"Hello, \" + name + \"!\");\n    }\n}",
            description: "Java class with constructor and methods"
        },
        'ArrayList': {
            code: "import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> list = new ArrayList<>();\n        \n        list.add(\"Item 1\");\n        list.add(\"Item 2\");\n        list.add(\"Item 3\");\n        \n        for (String item : list) {\n            System.out.println(item);\n        }\n    }\n}",
            description: "Using ArrayList"
        },
        'Try-Catch': {
            code: "try {\n    // Code that might throw an exception\n    int result = riskyOperation();\n} catch (Exception e) {\n    System.err.println(\"Error occurred: \" + e.getMessage());\n    e.printStackTrace();\n} finally {\n    System.out.println(\"Cleanup code\");\n}",
            description: "Exception handling"
        },
        'File I/O': {
            code: "import java.io.*;\n\npublic class FileExample {\n    public static void main(String[] args) {\n        // Read file\n        try (BufferedReader reader = new BufferedReader(new FileReader(\"input.txt\"))) {\n            String line;\n            while ((line = reader.readLine()) != null) {\n                System.out.println(line);\n            }\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n        \n        // Write file\n        try (BufferedWriter writer = new BufferedWriter(new FileWriter(\"output.txt\"))) {\n            writer.write(\"Hello, World!\");\n        } catch (IOException e) {\n            e.printStackTrace();\n        }\n    }\n}",
            description: "File reading and writing"
        },
        'Interface': {
            code: "interface Animal {\n    void makeSound();\n    void move();\n}\n\nclass Dog implements Animal {\n    @Override\n    public void makeSound() {\n        System.out.println(\"Woof!\");\n    }\n    \n    @Override\n    public void move() {\n        System.out.println(\"Dog is running\");\n    }\n}",
            description: "Interface implementation"
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeTemplates;
}
