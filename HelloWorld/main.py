import flet as ft
import flet_webview as ftwb

def main(page: ft.Page):
    page.title = "YT Shorts Player"
    page.window_width = 480
    page.window_height = 800

    # Input for the YouTube Short URL
    url_input = ft.TextField(
        label="YouTube Short URL",
        hint_text="https://youtu.be/… or https://youtube.com/shorts/…",
        width=400,
    )

    webview = ftwb.WebView(
        url="",
        expand = True
    )


    # Load button handler
    def load_short(e):
        link = url_input.value.strip()
        if "youtu.be/" in link or "/shorts/" in link:
            webview.url = link
            page.update()
        else:
            page.snack_bar = ft.SnackBar(ft.Text("Enter a valid Shorts link"))
            page.snack_bar.open = True
            page.update()

    load_btn = ft.ElevatedButton("Play Short", on_click=load_short)

    # Layout
    page.add(
        ft.Column(
            [
                ft.Row([url_input, load_btn], alignment=ft.MainAxisAlignment.START),
                webview,
            ],
            expand=True,
        )
    )

ft.app(target=main)
