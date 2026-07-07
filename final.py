from playwright.sync_api import sync_playwright
import os
path="file://"+os.path.abspath("index.html")
with sync_playwright() as p:
    b=p.chromium.launch()
    pg=b.new_page(viewport={"width":1440,"height":430})
    pg.goto(path); pg.wait_for_timeout(500)
    pg.screenshot(path="header_fixed.png")
    b.close()
print("ok")
