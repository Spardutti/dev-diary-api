from collections import defaultdict
from typing import List, Tuple
from django.db.models import QuerySet
from ..models import DailyNote

def group_by_month(queryset: QuerySet[DailyNote]) -> Tuple[List[str], defaultdict]:
    """
    Group notes by month in descending order (newest month first).

    :param queryset: Queryset of DailyNote instances
    :return: A tuple containing:
        - A list of sorted months (keys in 'YYYY-MM' format)
        - A defaultdict with notes grouped by month
    """
    grouped_items = defaultdict(list)

    # Group by Year-Month key
    for item in queryset:
        key = item.date.strftime('%Y-%m')  # Example: '2024-12'
        grouped_items[key].append(item)

    # Sort the months in descending order
    sorted_months = sorted(grouped_items.keys(), reverse=True)

    return sorted_months, grouped_items
