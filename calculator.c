#include <gtk/gtk.h>

static void perform_calculation(GtkWidget *widget, gpointer data) {
    GtkWidget *entry = GTK_WIDGET(data);
    const gchar *text = gtk_entry_get_text(GTK_ENTRY(entry));
    gdouble value = g_ascii_strtod(text, NULL);

    const gchar *button_label = gtk_button_get_label(GTK_BUTTON(widget));
    if (g_strcmp0(button_label, "+") == 0) {
        value += 1;
    } else if (g_strcmp0(button_label, "-") == 0) {
        value -= 1;
    } else if (g_strcmp0(button_label, "*") == 0) {
        value *= 2; // Just for simplicity, multiply by 2
    } else if (g_strcmp0(button_label, "/") == 0) {
        if (value != 0) value /= 2; // Division by 2 for simplicity
    }

    gchar *new_text = g_strdup_printf("%.2f", value);
    gtk_entry_set_text(GTK_ENTRY(entry), new_text);
    g_free(new_text);
}

int main(int argc, char *argv[]) {
    GtkWidget *window;
    GtkWidget *grid;
    GtkWidget *entry;
    GtkWidget *button;

    gtk_init(&argc, &argv);

    window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    gtk_window_set_title(GTK_WINDOW(window), "Calculator");
    gtk_container_set_border_width(GTK_CONTAINER(window), 10);
    gtk_widget_set_size_request(window, 200, 200);
    g_signal_connect(window, "destroy", G_CALLBACK(gtk_main_quit), NULL);

    grid = gtk_grid_new();
    gtk_container_add(GTK_CONTAINER(window), grid);

    entry = gtk_entry_new();
    gtk_entry_set_text(GTK_ENTRY(entry), "0.00");
    gtk_grid_attach(GTK_GRID(grid), entry, 0, 0, 4, 1);

    const gchar *operations[] = {"+", "-", "*", "/"};
    for (int i = 0; i < 4; ++i) {
        button = gtk_button_new_with_label(operations[i]);
        g_signal_connect(button, "clicked", G_CALLBACK(perform_calculation), entry);
        gtk_grid_attach(GTK_GRID(grid), button, i, 1, 1, 1);
    }

    gtk_widget_show_all(window);
    gtk_main();

    return 0;
}