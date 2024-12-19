from collections import defaultdict

def group_by_month(items):
        """
        Group notes by month in descending order (newest month first).
        """
        # Create a grouped structure
        grouped_items = defaultdict(list)
        
        for item in items:
            key = item.date.strftime('%Y-%m')  # Group by Year-Month
            grouped_items[key].append(item)

        # Sort months in descending order and serialize grouped notes
        sorted_months = sorted(grouped_items.keys(), reverse=True)  # Sort months in descending order

        return sorted_months, grouped_items
                