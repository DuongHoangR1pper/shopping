import os

# Define the folder structure
folder_structure = {
    "my_project": [
        ".env",
        "README.md",
        "requirements.txt",
        ("data", ["analysis.csv"]),
        ("display_payment_app", [
            "app.py",
            ("templates", ["index.html", "buy_form.html", "qr_payment.html"])
        ]),
        ("update_csv_app", [
            "app.py",
            ("templates", ["add_product.html"])
        ])
    ]
}

# Function to create directories and files
def create_structure(base_path, structure):
    for item in structure:
        if isinstance(item, str):
            # Create a file
            file_path = os.path.join(base_path, item)
            with open(file_path, 'w') as f:
                f.write("")  # Create an empty file
            print(f"Created file: {file_path}")

        elif isinstance(item, tuple):
            # Create a directory
            dir_name, sub_items = item
            dir_path = os.path.join(base_path, dir_name)
            os.makedirs(dir_path, exist_ok=True)
            print(f"Created directory: {dir_path}")
            create_structure(dir_path, sub_items)

# Create the base project directory
base_project = "my_project"
os.makedirs(base_project, exist_ok=True)

# Generate the file structure
create_structure(base_project, folder_structure["my_project"])

print("Project structure created successfully!")
