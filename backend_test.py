import requests
import sys
import json
from datetime import datetime

class TaamJhamAPITester:
    def __init__(self, base_url="https://flavor-burst-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if endpoint == "menu/categories":
                        categories = response_data.get('categories', [])
                        print(f"   Categories found: {len(categories)}")
                        for cat in categories:
                            print(f"     - {cat.get('name', 'N/A')} ({cat.get('id', 'N/A')})")
                    elif "menu" in endpoint:
                        items = response_data if isinstance(response_data, list) else []
                        print(f"   Menu items found: {len(items)}")
                        if items:
                            print(f"   First item: {items[0].get('name', 'N/A')} - ₹{items[0].get('price', 'N/A')}")
                    elif endpoint == "contact":
                        print(f"   Contact message ID: {response_data.get('id', 'N/A')}")
                except:
                    print(f"   Raw response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.results.append({
                'test': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': response.status_code,
                'success': success,
                'response_size': len(response.text) if response.text else 0
            })

            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout (10s)")
            self.results.append({
                'test': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': 'TIMEOUT',
                'success': False,
                'response_size': 0
            })
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                'test': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': 'ERROR',
                'success': False,
                'response_size': 0
            })
            return False, {}

def main():
    print("🍛 Starting Taam Jham Restaurant API Testing")
    print("=" * 50)
    
    tester = TaamJhamAPITester()

    # Test 1: Root API endpoint
    success, response = tester.run_test(
        "API Root Endpoint",
        "GET",
        "",
        200
    )

    # Test 2: Get all menu categories (should return 5 categories)
    success, response = tester.run_test(
        "Get Menu Categories",
        "GET",
        "menu/categories",
        200
    )
    
    if success:
        categories = response.get('categories', [])
        if len(categories) == 5:
            print(f"✅ Correct number of categories: {len(categories)}")
        else:
            print(f"⚠️  Expected 5 categories, got {len(categories)}")

    # Test 3: Get all menu items
    success, response = tester.run_test(
        "Get All Menu Items",
        "GET",
        "menu",
        200
    )

    # Test 4: Get North Indian menu items
    success, response = tester.run_test(
        "Get North Indian Menu",
        "GET",
        "menu",
        200,
        params={"category": "north-indian"}
    )

    # Test 5: Get Italian menu items
    success, response = tester.run_test(
        "Get Italian Menu", 
        "GET",
        "menu",
        200,
        params={"category": "italian"}
    )

    # Test 6: Get Indo-Chinese menu items
    success, response = tester.run_test(
        "Get Indo-Chinese Menu",
        "GET", 
        "menu",
        200,
        params={"category": "indo-chinese"}
    )

    # Test 7: Get Fast Food menu items
    success, response = tester.run_test(
        "Get Fast Food Menu",
        "GET",
        "menu", 
        200,
        params={"category": "fast-food"}
    )

    # Test 8: Get Beverages menu items
    success, response = tester.run_test(
        "Get Beverages Menu",
        "GET",
        "menu",
        200,
        params={"category": "beverages"}
    )

    # Test 9: Submit contact form
    contact_data = {
        "name": "Test User",
        "email": "test@example.com", 
        "phone": "+91 9876543210",
        "message": "This is a test message from automated testing."
    }
    
    success, response = tester.run_test(
        "Submit Contact Form",
        "POST",
        "contact",
        200,
        data=contact_data
    )

    # Test 10: Test invalid category
    success, response = tester.run_test(
        "Invalid Category Test",
        "GET",
        "menu",
        200,
        params={"category": "nonexistent-category"}
    )

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print("=" * 50)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    # Print failed tests
    failed_tests = [r for r in tester.results if not r['success']]
    if failed_tests:
        print(f"\n❌ Failed Tests ({len(failed_tests)}):")
        for test in failed_tests:
            print(f"   - {test['test']}: {test['actual_status']}")
    else:
        print(f"\n🎉 All tests passed!")

    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())